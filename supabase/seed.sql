/-- =========================================================================
-- UPDATED SEED DATA FOR TSA CULINARY OPERATIONS SYSTEM (2025-2026)
-- Copy and paste this into Supabase SQL Editor to populate initial data.
-- =========================================================================

BEGIN;

TRUNCATE public.action_items, public.lessons, public.reimbursements, public.equipment_loans, 
         public.grocery_runs, public.shopping_items, public.timeline_steps, public.staff_members, 
         public.dishes, public.events CASCADE;

-- 1. Events (Shifted to 25/26, all Completed)
INSERT INTO public.events (id, name, date, location, attendees, budget, status, summary, is_archived) VALUES
  ('da7e8001-c852-442c-a2d6-1b55928f411b', 'TSA Night Market', '2026-04-04', 'Main Quad', 350, 2500, 'Completed', 'The flagship annual outdoor food festival showcasing authentic Taiwanese night market culture. Features multiple food stalls, games, and cultural performances.', true);
INSERT INTO public.events (id, name, date, location, attendees, budget, status, summary, is_archived) VALUES
  ('da7e8002-c852-442c-a2d6-1b55928f411b', 'Taste of Taiwan', '2025-11-12', 'Ern Commons', 200, 1800, 'Completed', 'An elegant cultural dinner presenting authentic dishes, artistic showcases, and student displays to celebrate Taiwanese heritage.', true);
INSERT INTO public.events (id, name, date, location, attendees, budget, status, summary, is_archived) VALUES
  ('da7e8003-c852-442c-a2d6-1b55928f411b', 'Dumpling Making', '2025-09-15', 'Shea House', 120, 800, 'Completed', 'A welcome gathering designed to introduce first-year students to the TSA community over dumpling making and bubble tea.', true);
INSERT INTO public.events (id, name, date, location, attendees, budget, status, summary, is_archived) VALUES
  ('da7e8004-c852-442c-a2d6-1b55928f411b', 'Mid-Autumn Festival', '2025-09-28', 'Clemons Courtyard', 180, 1200, 'Completed', 'Gathering students under the full moon to celebrate the Mid-Autumn Festival with mooncakes, pomelos, and delicious BBQ Skewers.', true);
INSERT INTO public.events (id, name, date, location, attendees, budget, status, summary, is_archived) VALUES
  ('da7e8005-c852-442c-a2d6-1b55928f411b', 'MAID Cafe', '2026-02-10', 'Ern Commons', 250, 3000, 'Completed', 'A massive collaboration between Culinary, Fundy, and Mem bringing a specialty cafe experience to campus.', true);

-- 2. Dishes
INSERT INTO public.dishes (id, event_id, name, category, servings, estimated_cost) VALUES
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Popcorn Chicken', 'Main', 350, 600),
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Taiwanese Sausage', 'Side', 300, 450),
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Scallion Pancakes', 'Side', 250, 300),
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Bubble Tea', 'Beverage', 400, 500),
  
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Beef Noodle Soup', 'Main', 200, 550),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Scallion Pancakes', 'Side', 200, 250),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Popcorn Chicken', 'Side', 200, 300),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Cucumber Salad & Tea Eggs', 'Side', 200, 150),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Almond Jelly', 'Dessert', 200, 200),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Fruit Green Teas', 'Beverage', 200, 350),

  (gen_random_uuid(), 'da7e8003-c852-442c-a2d6-1b55928f411b', 'Pork Dumplings', 'Main', 100, 250),
  (gen_random_uuid(), 'da7e8003-c852-442c-a2d6-1b55928f411b', 'Vegetarian Dumplings', 'Main', 50, 150),
  (gen_random_uuid(), 'da7e8003-c852-442c-a2d6-1b55928f411b', 'Bubble Tea', 'Beverage', 150, 200),

  (gen_random_uuid(), 'da7e8004-c852-442c-a2d6-1b55928f411b', 'BBQ Skewers', 'Main', 180, 450),
  (gen_random_uuid(), 'da7e8004-c852-442c-a2d6-1b55928f411b', 'Taiwanese Sausage', 'Side', 150, 250),
  (gen_random_uuid(), 'da7e8004-c852-442c-a2d6-1b55928f411b', 'Scallion Pancakes', 'Side', 150, 200),

  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Braised Porkbelly Bao Buns', 'Main', 250, 800),
  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Popcorn Chicken', 'Side', 250, 600),
  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Milk Tea Tiramisu', 'Dessert', 200, 400),
  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Egg Tarts', 'Dessert', 200, 300),
  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Butterfly Pea Passionfruit Green Tea', 'Beverage', 250, 400);

-- 3. Grocery Runs (All Completed)
INSERT INTO public.grocery_runs (id, event_id, driver_name_fallback, vehicle, destination, departure, status) VALUES
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Albert', 'SUV', 'Lotte Plaza Market', '3:00 PM', 'Completed'),
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Brian', 'Minivan', 'Costco', '4:30 PM', 'Completed'),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Albert', 'SUV', 'New Grand Mart', '2:00 PM', 'Completed'),
  (gen_random_uuid(), 'da7e8003-c852-442c-a2d6-1b55928f411b', 'Michelle', 'Sedan', 'Costco', '10:00 AM', 'Completed'),
  (gen_random_uuid(), 'da7e8004-c852-442c-a2d6-1b55928f411b', 'Kevin', 'SUV', 'Walmart', '11:00 AM', 'Completed'),
  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Kevin', 'SUV', 'Lotte Plaza Market', '2:00 PM', 'Completed');

-- 4. Equipment Loans (All Returned)
INSERT INTO public.equipment_loans (id, event_id, item, owner_name_fallback, date_brought, date_returned, returned) VALUES
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Butane Burners', 'Sophia', 'Apr 3', 'Apr 5', true),
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Folding Tables', 'Grace', 'Apr 3', 'Apr 5', true),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Commercial Rice Cooker', 'Grace', 'Nov 11', 'Nov 13', true),
  (gen_random_uuid(), 'da7e8003-c852-442c-a2d6-1b55928f411b', 'Multiple Kettles', 'Andy', 'Sep 14', 'Sep 16', true),
  (gen_random_uuid(), 'da7e8004-c852-442c-a2d6-1b55928f411b', 'Charcoal Grills', 'Sophia', 'Sep 27', 'Sep 29', true),
  (gen_random_uuid(), 'da7e8004-c852-442c-a2d6-1b55928f411b', 'Coolers', 'Grace', 'Sep 27', 'Sep 29', true),
  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Commercial Fryers', 'Andy', 'Feb 9', 'Feb 11', true);

-- 5. Reimbursements (Processed)
INSERT INTO public.reimbursements (id, event_id, buyer_name_fallback, purpose, amount, receipt_status, status) VALUES
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Kevin', 'Costco ingredient purchases', 450, 'Uploaded', 'Venmo Sent'),
  (gen_random_uuid(), 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Andy', 'Fuel reimbursement for grocery runs', 40, 'Uploaded', 'Venmo Sent'),
  (gen_random_uuid(), 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Grace', 'Disposable utensils', 60, 'Uploaded', 'Venmo Sent'),
  (gen_random_uuid(), 'da7e8003-c852-442c-a2d6-1b55928f411b', 'Michelle', 'Dumpling supplies', 220, 'Uploaded', 'Venmo Sent'),
  (gen_random_uuid(), 'da7e8004-c852-442c-a2d6-1b55928f411b', 'Kevin', 'Grocery Run', 300, 'Uploaded', 'Venmo Sent'),
  (gen_random_uuid(), 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Albert', 'Costco and Specialty purchases', 850, 'Uploaded', 'Venmo Sent');

-- 6. Action Items (Based on Transition Document Feedback)
INSERT INTO public.action_items (id, event_id, type, title, description, resolved) VALUES
  ('da7e800a-c852-442c-a2d6-000000000001', 'da7e8003-c852-442c-a2d6-1b55928f411b', 'Shopping', 'Procure electric kettles for boiling.', 'Procure 3-4 electric kettles before the first Dumpling Making event to overcome slow venue burners.', false),
  ('da7e800a-c852-442c-a2d6-000000000002', 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Menu', 'Prioritize Ern Commons bookings.', 'Always attempt to book Ern Commons first for large-scale cooking events instead of the Ballroom.', false),
  ('da7e800a-c852-442c-a2d6-000000000003', 'da7e8001-c852-442c-a2d6-1b55928f411b', 'Budget', 'Enforce external org reimbursement caps.', 'Update all Fall/Spring collaboration forms to hardcode the $100 reimbursement limit for external orgs.', false),
  ('da7e800a-c852-442c-a2d6-000000000004', 'da7e8005-c852-442c-a2d6-1b55928f411b', 'Shopping', 'Purchase a fat stirring spoon.', 'Purchase a large whisk for the 5-gallon beverage coolers, and check all coolers for lingering scents 1-2 weeks prior.', false),
  ('da7e800a-c852-442c-a2d6-000000000005', 'da7e8002-c852-442c-a2d6-1b55928f411b', 'Staffing', 'Implement fridge space checklist.', 'Implement a strict fridge space secured checklist item prior to approving any raw ingredient grocery runs.', false);

COMMIT;