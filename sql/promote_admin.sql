-- Promote a user to Admin role
-- Replace 'YOUR_EMAIL_HERE' with the email address you use to log in

UPDATE public.users
SET role = 'admin'
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify the change
SELECT * FROM public.users WHERE email = 'YOUR_EMAIL_HERE';
