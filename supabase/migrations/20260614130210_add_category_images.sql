UPDATE categories SET image_url = CASE id
  WHEN 'c1b2c3d4-0001-0001-0001-000000000001' THEN 'https://images.pexels.com/photos/14013443/pexels-photo-14013443.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000002' THEN 'https://images.pexels.com/photos/5899189/pexels-photo-5899189.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000003' THEN 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000004' THEN 'https://images.pexels.com/photos/4145842/pexels-photo-4145842.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000005' THEN 'https://images.pexels.com/photos/1547565/pexels-photo-1547565.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000006' THEN 'https://images.pexels.com/photos/1624895/pexels-photo-1624895.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000007' THEN 'https://images.pexels.com/photos/14013443/pexels-photo-14013443.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000008' THEN 'https://images.pexels.com/photos/3806289/pexels-photo-3806289.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000009' THEN 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400'
  WHEN 'c1b2c3d4-0001-0001-0001-000000000010' THEN 'https://images.pexels.com/photos/3806289/pexels-photo-3806289.jpeg?auto=compress&cs=tinysrgb&w=400'
  ELSE image_url
END
WHERE id IN (
  'c1b2c3d4-0001-0001-0001-000000000001',
  'c1b2c3d4-0001-0001-0001-000000000002',
  'c1b2c3d4-0001-0001-0001-000000000003',
  'c1b2c3d4-0001-0001-0001-000000000004',
  'c1b2c3d4-0001-0001-0001-000000000005',
  'c1b2c3d4-0001-0001-0001-000000000006',
  'c1b2c3d4-0001-0001-0001-000000000007',
  'c1b2c3d4-0001-0001-0001-000000000008',
  'c1b2c3d4-0001-0001-0001-000000000009',
  'c1b2c3d4-0001-0001-0001-000000000010'
);