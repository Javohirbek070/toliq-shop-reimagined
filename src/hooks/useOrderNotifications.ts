import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/hooks/useProducts";

interface NewOrder {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  created_at: string;
}

export function useOrderNotifications() {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [latestOrder, setLatestOrder] = useState<NewOrder | null>(null);
  const { toast } = useToast();

  const playNotificationSound = useCallback(() => {
    // Create a simple notification sound using Web Audio API
    try {
      const AudioContextConstructor = window.AudioContext || (window as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextConstructor();
      
      // First beep
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      oscillator1.frequency.value = 800;
      oscillator1.type = "sine";
      gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.2);

      // Second beep (higher pitch)
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      oscillator2.frequency.value = 1000;
      oscillator2.type = "sine";
      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.25);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.45);
      oscillator2.start(audioContext.currentTime + 0.25);
      oscillator2.stop(audioContext.currentTime + 0.45);
    } catch (error) {
      console.log("Audio notification not supported");
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNewOrdersCount(0);
    setLatestOrder(null);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("New order received:", payload);
          const newOrder = payload.new as NewOrder;
          
          setNewOrdersCount((prev) => prev + 1);
          setLatestOrder(newOrder);
          
          // Play notification sound
          playNotificationSound();
          
          // Show toast notification
          toast({
            title: "🔔 Yangi buyurtma!",
            description: `${newOrder.customer_name} - ${formatPrice(newOrder.total)}`,
            duration: 10000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, playNotificationSound]);

  return {
    newOrdersCount,
    latestOrder,
    clearNotifications,
  };
}
