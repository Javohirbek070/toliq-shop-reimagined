import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CafeSettings {
  id: string;
  cafe_name: string;
  phone: string;
  address: string;
  working_hours: string;
  description: string;
  is_delivery_active: boolean;
  min_order_amount: number;
  delivery_fee: number;
  updated_at: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ["cafe-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cafe_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as CafeSettings | null;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<CafeSettings>) => {
      const { data, error } = await supabase
        .from("cafe_settings")
        .update({
          cafe_name: settings.cafe_name,
          phone: settings.phone,
          address: settings.address,
          working_hours: settings.working_hours,
          description: settings.description,
          is_delivery_active: settings.is_delivery_active,
          min_order_amount: settings.min_order_amount,
          delivery_fee: settings.delivery_fee,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      return data as CafeSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafe-settings"] });
    },
  });
}
