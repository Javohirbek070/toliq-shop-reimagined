/*
  # Create cafe settings table

  1. New Tables
    - `cafe_settings`
      - `id` (uuid, primary key)
      - `cafe_name` (text)
      - `phone` (text)
      - `address` (text)
      - `working_hours` (text)
      - `description` (text)
      - `is_delivery_active` (boolean)
      - `min_order_amount` (integer)
      - `delivery_fee` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cafe_settings` table
    - Add policy for authenticated users to read settings
    - Add policy for admin users to update settings
*/

CREATE TABLE IF NOT EXISTS cafe_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_name text NOT NULL DEFAULT 'Safi Café',
  phone text NOT NULL DEFAULT '+998 90 123 45 67',
  address text NOT NULL DEFAULT 'Toshkent',
  working_hours text NOT NULL DEFAULT '09:00 - 23:00',
  description text NOT NULL DEFAULT 'Premium kafe',
  is_delivery_active boolean NOT NULL DEFAULT true,
  min_order_amount integer NOT NULL DEFAULT 30000,
  delivery_fee integer NOT NULL DEFAULT 10000,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cafe_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cafe settings"
  ON cafe_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can update cafe settings"
  ON cafe_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'owner')
    )
  );

INSERT INTO cafe_settings (cafe_name, phone, address, working_hours, description, is_delivery_active, min_order_amount, delivery_fee)
VALUES ('Safi Café', '+998 90 123 45 67', 'Toshkent, Chilonzor tumani, 1-mavze', '09:00 - 23:00', 'Premium kafe - tezkor taomlar, shirinliklar va ichimliklar', true, 30000, 10000)
ON CONFLICT DO NOTHING;
