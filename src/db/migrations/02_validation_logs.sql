-- Create equipment_validations table
create table if not exists equipment_validations (
  id uuid default uuid_generate_v4() primary key,
  equipment_id uuid references equipment(id) on delete cascade not null,
  validation_type text check (validation_type in ('IQ', 'OQ', 'PQ')) not null,
  status text check (status in ('PASS', 'FAIL', 'PENDING')) not null,
  validation_date date not null,
  performed_by text not null,
  report_url text, -- URL or link to the report document
  notes text,
  next_validation_due date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table equipment_validations enable row level security;

-- Create policies (allowing all access for authenticated users for now, can be refined)
create policy "Enable read access for authenticated users"
  on equipment_validations for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users"
  on equipment_validations for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users"
  on equipment_validations for update
  using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users"
  on equipment_validations for delete
  using (auth.role() = 'authenticated');
