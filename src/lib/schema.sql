-- 1. Agencies (Multi-tenancy Root)
CREATE TABLE IF NOT EXISTS agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Team Members (Cadastro de Vendedores e Staff)
CREATE TABLE IF NOT EXISTS team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT, -- Owner, Manager, Seller, RH, Admin
    conversion NUMERIC(5,2) DEFAULT 0,
    execution NUMERIC(5,2) DEFAULT 0,
    sales INTEGER DEFAULT 0,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Leads (Funnel / Pipeline)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    car TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'Lead', -- Lead, Contato, Agendamento, Visita, Proposta, Venda, Perdido
    sla_minutes INTEGER DEFAULT 5, -- Default SLA from PRD
    source TEXT, -- Internet, Porta, Carteira
    value NUMERIC(12,2) DEFAULT 0,
    score INTEGER DEFAULT 50,
    last_action TEXT,
    loss_reason TEXT,
    stagnant_days INTEGER DEFAULT 0,
    seller_id UUID REFERENCES team(id) ON DELETE SET NULL,
    first_contact_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tasks (Atividades e Tarefas)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    priority TEXT DEFAULT 'Média', -- Alta, Média, Baixa
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES team(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Pendente', -- Pendente, Concluída, Atrasada
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Appointments (Agendamentos vinculados a leads)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES team(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    type TEXT DEFAULT 'Visita', -- Visita, Test-drive, Entrega
    status TEXT DEFAULT 'Agendado', -- Agendado, Confirmado, Realizado, Cancelado, No-show
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Visits (Registro de visitas reais com validação)
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES team(id) ON DELETE CASCADE,
    check_in TIMESTAMPTZ DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    verified BOOLEAN DEFAULT FALSE, -- QR Code / Geofence validation
    verification_method TEXT, -- QR, Manual, GPS
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Proposals (Histórico de propostas)
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES team(id) ON DELETE SET NULL,
    value NUMERIC(12,2) NOT NULL,
    profit_margin NUMERIC(5,2),
    status TEXT DEFAULT 'Apresentada', -- Apresentada, Negociação, Aceita, Recusada
    conditions JSONB, -- Prazos, taxa, entrada
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Inventory (Estoque Real)
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    brand TEXT,
    year INTEGER,
    plate TEXT UNIQUE,
    price NUMERIC(12,2) NOT NULL,
    cost_price NUMERIC(12,2),
    status TEXT DEFAULT 'Disponível', -- Disponível, Reservado, Vendido
    aging_days INTEGER DEFAULT 0,
    mileage INTEGER,
    fuel_type TEXT,
    transmission TEXT,
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Commissions (Vendas concluídas e Repasses)
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES team(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
    sale_date DATE DEFAULT CURRENT_DATE,
    profit_margin NUMERIC(5,2),
    commission_amount NUMERIC(12,2),
    status TEXT DEFAULT 'Pendente', -- Pendente, Pago
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Commission Rules (Regras de Cálculo)
CREATE TABLE IF NOT EXISTS commission_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES team(id) ON DELETE CASCADE,
    vehicle_type TEXT,
    margin_min NUMERIC(5,2),
    margin_max NUMERIC(5,2),
    percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Goals (Metas de Vendas)
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'Equipe' ou 'Individual'
    target_id UUID REFERENCES team(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE),
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Attendance (Ponto Digital)
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES team(id) ON DELETE CASCADE,
    check_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    location_coords JSONB, -- {lat, lng}
    status TEXT DEFAULT 'Presente', -- Presente, Almoço, Folga, Falta
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Logs (Histórico para IA Diagnostics)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID, -- Referência ao usuário logado (opcional)
    action TEXT NOT NULL,
    resource TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notifications (Alertas do Sistema)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES team(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT, -- SLA, Alerta, Meta
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Communication Configs
CREATE TABLE IF NOT EXISTS communication_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'daily_report', 'weekly_report', 'monthly_report', 'opening', 'closing', 'scheduling', 'performance'
    is_active BOOLEAN DEFAULT FALSE,
    time_to_trigger TEXT, -- HH:MM format
    days_of_week TEXT[],
    target_roles TEXT[],
    custom_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared Functions & Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()', t, t);
    END LOOP;
END;
$$;
