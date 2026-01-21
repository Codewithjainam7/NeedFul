-- Seed Data for NeedFul Admin Testing
-- Run this in the Supabase SQL Editor to populate charts

-- 1. Insert Categories (if needed, usually already exists)
INSERT INTO categories (name, slug, icon, description) VALUES
('Home Services', 'home-services', 'Hammer', 'Plumbing, Electrician, etc'),
('Health & Wellness', 'health-wellness', 'Heart', 'Gyms, Yoga, Doctors'),
('Food & Dining', 'food-dining', 'Utensils', 'Restaurants, Cafes');

-- 2. Insert Users (created over different months for chart trends)
INSERT INTO users (email, name, role, created_at) VALUES
('user1@example.com', 'Alice Johnson', 'user', NOW() - INTERVAL '5 months'),
('user2@example.com', 'Bob Smith', 'user', NOW() - INTERVAL '4 months'),
('user3@example.com', 'Charlie Davis', 'user', NOW() - INTERVAL '3 months'),
('user4@example.com', 'Diana Evans', 'user', NOW() - INTERVAL '2 months'),
('user5@example.com', 'Evan Wright', 'user', NOW() - INTERVAL '1 month'),
('user6@example.com', 'Fiona Hill', 'user', NOW()),
('user7@example.com', 'George Baker', 'user', NOW()),
('user8@example.com', 'Hannah Scott', 'user', NOW());

-- 3. Insert Providers (Businesses)
INSERT INTO providers (user_id, business_name, description, city, is_verified, rating, created_at) 
-- Note: Assuming user_ids exist or using placeholders. In real usage, link to actual user IDs.
-- Here we use subqueries to pick a user ID if needed, or just insert raw if constraints allow null user_id (depends on schema).
-- Assuming basic insert for demo:
VALUES 
((SELECT id FROM users WHERE email='user1@example.com'), 'Elite Plumbers', 'Best plumbing in town', 'New York', true, 4.8, NOW() - INTERVAL '4 months'),
((SELECT id FROM users WHERE email='user2@example.com'), 'City Gym', '24/7 Fitness Center', 'Los Angeles', true, 4.5, NOW() - INTERVAL '3 months'),
((SELECT id FROM users WHERE email='user3@example.com'), 'Taco Fiesta', 'Authentic Mexican Tacos', 'Chicago', false, 0, NOW()),
((SELECT id FROM users WHERE email='user4@example.com'), 'Sunrise Cafe', 'Best breakfast', 'New York', true, 4.2, NOW() - INTERVAL '1 month');

-- 4. Insert Reviews
INSERT INTO reviews (user_id, provider_id, rating, comment, created_at) VALUES
((SELECT id FROM users WHERE email='user6@example.com'), (SELECT id FROM providers WHERE business_name='Elite Plumbers'), 5, 'Great service!', NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE email='user7@example.com'), (SELECT id FROM providers WHERE business_name='City Gym'), 4, 'Good equipment but crowded', NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE email='user8@example.com'), (SELECT id FROM providers WHERE business_name='Elite Plumbers'), 5, 'Highly recommended', NOW());
