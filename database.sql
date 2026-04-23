-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.carts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid DEFAULT gen_random_uuid(),
  product_id bigint,
  quantity integer DEFAULT 1,
  CONSTRAINT carts_pkey PRIMARY KEY (id),
  CONSTRAINT carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.categories (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order_details (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id bigint NOT NULL,
  user_id uuid NOT NULL,
  product_id bigint NOT NULL,
  product_name text NOT NULL,
  product_image text,
  price numeric NOT NULL,
  quantity integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT order_details_pkey PRIMARY KEY (id),
  CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.orders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  total_price numeric NOT NULL,
  status text DEFAULT 'Chờ xác nhận'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  ten text NOT NULL,
  gia bigint NOT NULL,
  anh ARRAY,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  description text DEFAULT 'null'::text,
  category_id bigint,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  role text DEFAULT 'user'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_addresses (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid DEFAULT gen_random_uuid(),
  recipient_name text,
  phone_number text,
  detailed_address text,
  is_default boolean,
  CONSTRAINT user_addresses_pkey PRIMARY KEY (id),
  CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);