-- Create sequences first
CREATE SEQUENCE IF NOT EXISTS coins_balance_changes_id_seq;
CREATE SEQUENCE IF NOT EXISTS devices_id_seq;
CREATE SEQUENCE IF NOT EXISTS in_app_purchases_id_seq;
CREATE SEQUENCE IF NOT EXISTS play_history_id_seq;
CREATE SEQUENCE IF NOT EXISTS players_id_seq;
CREATE SEQUENCE IF NOT EXISTS users_vouchers_id_seq;
CREATE SEQUENCE IF NOT EXISTS vouchers_id_seq;

-- Create tables
CREATE TABLE public.admin_users (
                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                    email text NOT NULL UNIQUE,
                                    display_name text NOT NULL,
                                    is_active boolean DEFAULT true,
                                    last_login_at timestamp with time zone,
                                    created_at timestamp with time zone DEFAULT now(),
                                    updated_at timestamp with time zone DEFAULT now(),
                                    CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.players (
                                id bigint NOT NULL DEFAULT nextval('players_id_seq'::regclass),
                                visitor_id character varying NOT NULL UNIQUE,
                                name text,
                                email text,
                                phone text,
                                coins_balance double precision NOT NULL DEFAULT 0,
                                level integer NOT NULL DEFAULT 1,
                                pid text,
                                c text,
                                af_channel text,
                                af_adset text,
                                af_ad text,
                                af_keywords text[],
                                is_retargeting boolean,
                                af_click_lookback smallint,
                                af_viewthrough_lookback smallint,
                                af_sub1 text,
                                af_sub2 text,
                                af_sub3 text,
                                af_sub4 text,
                                af_sub5 text,
                                created_at timestamp with time zone DEFAULT now(),
                                updated_at timestamp with time zone DEFAULT now(),
                                auth_user_id uuid,
                                age_checkbox boolean,
                                scratch_cards integer DEFAULT 0,
                                CONSTRAINT players_pkey PRIMARY KEY (id)
);

CREATE TABLE public.coins_balance_changes (
                                              id bigint NOT NULL DEFAULT nextval('coins_balance_changes_id_seq'::regclass),
                                              user_id bigint NOT NULL,
                                              balance_before double precision NOT NULL,
                                              balance_after double precision NOT NULL,
                                              amount double precision NOT NULL,
                                              mode character varying NOT NULL,
                                              status character varying NOT NULL,
                                              created_at timestamp with time zone DEFAULT now(),
                                              updated_at timestamp with time zone DEFAULT now(),
                                              CONSTRAINT coins_balance_changes_pkey PRIMARY KEY (id),
                                              CONSTRAINT coins_balance_changes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.players(id)
);

CREATE TABLE public.devices (
                                id bigint NOT NULL DEFAULT nextval('devices_id_seq'::regclass),
                                user_id bigint NOT NULL,
                                udid character varying NOT NULL,
                                os_type character varying,
                                os_version character varying,
                                browser character varying,
                                ip character varying,
                                city character varying,
                                country character varying,
                                isp character varying,
                                timezone character varying,
                                device_fb_id character varying,
                                logged_at timestamp with time zone NOT NULL,
                                created_at timestamp with time zone DEFAULT now(),
                                updated_at timestamp with time zone DEFAULT now(),
                                CONSTRAINT devices_pkey PRIMARY KEY (id),
                                CONSTRAINT devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.players(id)
);

CREATE TABLE public.in_app_purchases (
                                         id bigint NOT NULL DEFAULT nextval('in_app_purchases_id_seq'::regclass),
                                         user_id bigint NOT NULL,
                                         platform text NOT NULL,
                                         product_id text NOT NULL,
                                         transaction_id text NOT NULL UNIQUE,
                                         amount double precision NOT NULL,
                                         currency text DEFAULT 'USD'::text,
                                         purchased_at timestamp with time zone NOT NULL,
                                         created_at timestamp with time zone DEFAULT now(),
                                         updated_at timestamp with time zone DEFAULT now(),
                                         CONSTRAINT in_app_purchases_pkey PRIMARY KEY (id),
                                         CONSTRAINT in_app_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.players(id)
);

CREATE TABLE public.play_history (
                                     id bigint NOT NULL DEFAULT nextval('play_history_id_seq'::regclass),
                                     user_id bigint NOT NULL,
                                     bet double precision NOT NULL,
                                     won double precision NOT NULL,
                                     lost double precision NOT NULL,
                                     game_name character varying NOT NULL,
                                     created_at timestamp with time zone DEFAULT now(),
                                     updated_at timestamp with time zone DEFAULT now(),
                                     CONSTRAINT play_history_pkey PRIMARY KEY (id),
                                     CONSTRAINT play_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.players(id)
);

CREATE TABLE public.vouchers (
                                 id bigint NOT NULL DEFAULT nextval('vouchers_id_seq'::regclass),
                                 cost double precision NOT NULL,
                                 provider character varying NOT NULL,
                                 img_url character varying NOT NULL,
                                 created_at timestamp with time zone DEFAULT now(),
                                 updated_at timestamp with time zone DEFAULT now(),
                                 CONSTRAINT vouchers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users_vouchers (
                                       id bigint NOT NULL DEFAULT nextval('users_vouchers_id_seq'::regclass),
                                       user_id bigint NOT NULL,
                                       voucher_id bigint NOT NULL,
                                       created_at timestamp with time zone DEFAULT now(),
                                       updated_at timestamp with time zone DEFAULT now(),
                                       CONSTRAINT users_vouchers_pkey PRIMARY KEY (id),
                                       CONSTRAINT users_vouchers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.players(id),
                                       CONSTRAINT users_vouchers_voucher_id_fkey FOREIGN KEY (voucher_id) REFERENCES public.vouchers(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_players_visitor_id ON players(visitor_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_udid ON devices(udid);
CREATE INDEX IF NOT EXISTS idx_coins_balance_changes_user_id ON coins_balance_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_user_id ON play_history(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_created_at ON play_history(created_at);
CREATE INDEX IF NOT EXISTS idx_in_app_purchases_user_id ON in_app_purchases(user_id);