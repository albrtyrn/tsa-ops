-- =========================================================================
-- ADD EVENT METADATA COLUMNS
-- =========================================================================

-- Create enums for the new status columns
create type venue_status as enum ('Requested', 'Approved', 'Denied');
create type funding_status as enum ('Pending Review', 'Approved', 'Rejected');

-- Add new columns to the events table
alter table public.events
  add column venue_status venue_status not null default 'Requested',
  add column funding_status funding_status not null default 'Pending Review',
  add column google_sheets_link text,
  add column debrief_doc_link text;
