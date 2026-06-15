UPDATE parts SET image_url = CASE id
  WHEN 'e1b2c3d4-0001-0001-0001-000000000001' THEN 'https://images.pexels.com/photos/14013443/pexels-photo-14013443.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000002' THEN 'https://images.pexels.com/photos/1624895/pexels-photo-1624895.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000003' THEN 'https://images.pexels.com/photos/5899189/pexels-photo-5899189.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000004' THEN 'https://images.pexels.com/photos/5899189/pexels-photo-5899189.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000005' THEN 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000006' THEN 'https://images.pexels.com/photos/4145842/pexels-photo-4145842.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000007' THEN 'https://images.pexels.com/photos/4145842/pexels-photo-4145842.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000008' THEN 'https://images.pexels.com/photos/1624895/pexels-photo-1624895.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000009' THEN 'https://images.pexels.com/photos/1624895/pexels-photo-1624895.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000010' THEN 'https://images.pexels.com/photos/14013443/pexels-photo-14013443.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000011' THEN 'https://images.pexels.com/photos/3806289/pexels-photo-3806289.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000012' THEN 'https://images.pexels.com/photos/1547565/pexels-photo-1547565.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000013' THEN 'https://images.pexels.com/photos/1547565/pexels-photo-1547565.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000014' THEN 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000015' THEN 'https://images.pexels.com/photos/4145842/pexels-photo-4145842.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000016' THEN 'https://images.pexels.com/photos/3806289/pexels-photo-3806289.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000017' THEN 'https://images.pexels.com/photos/14013443/pexels-photo-14013443.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000018' THEN 'https://images.pexels.com/photos/5899189/pexels-photo-5899189.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000019' THEN 'https://images.pexels.com/photos/4145842/pexels-photo-4145842.jpeg?auto=compress&cs=tinysrgb&w=600'
  WHEN 'e1b2c3d4-0001-0001-0001-000000000020' THEN 'https://images.pexels.com/photos/14013443/pexels-photo-14013443.jpeg?auto=compress&cs=tinysrgb&w=600'
  ELSE image_url
END
WHERE id IN (
  'e1b2c3d4-0001-0001-0001-000000000001',
  'e1b2c3d4-0001-0001-0001-000000000002',
  'e1b2c3d4-0001-0001-0001-000000000003',
  'e1b2c3d4-0001-0001-0001-000000000004',
  'e1b2c3d4-0001-0001-0001-000000000005',
  'e1b2c3d4-0001-0001-0001-000000000006',
  'e1b2c3d4-0001-0001-0001-000000000007',
  'e1b2c3d4-0001-0001-0001-000000000008',
  'e1b2c3d4-0001-0001-0001-000000000009',
  'e1b2c3d4-0001-0001-0001-000000000010',
  'e1b2c3d4-0001-0001-0001-000000000011',
  'e1b2c3d4-0001-0001-0001-000000000012',
  'e1b2c3d4-0001-0001-0001-000000000013',
  'e1b2c3d4-0001-0001-0001-000000000014',
  'e1b2c3d4-0001-0001-0001-000000000015',
  'e1b2c3d4-0001-0001-0001-000000000016',
  'e1b2c3d4-0001-0001-0001-000000000017',
  'e1b2c3d4-0001-0001-0001-000000000018',
  'e1b2c3d4-0001-0001-0001-000000000019',
  'e1b2c3d4-0001-0001-0001-000000000020'
);