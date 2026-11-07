import mongoose from 'mongoose';

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/dolean');
  const db = mongoose.connection.db;
  const courses = await db.collection('courses').find({ deleteState: { $ne: true } }).toArray();
  console.log(`Found ${courses.length} courses:`);
  for (const c of courses) {
    console.log(`- ${c.title} | Location: ${c.location} | City: ${c.locationDetails?.city} | Type: ${c.locationType} | Price: ${JSON.stringify(c.price)}`);
  }
  const totalUsers = await db.collection('users').countDocuments({ deleteState: { $ne: true } });
  const totalOrgs = await db.collection('organizations').countDocuments({ deleteState: { $ne: true } });
  const totalRequests = await db.collection('studentrequests').countDocuments({});
  console.log(`Stats -> Orgs: ${totalOrgs}, Courses: ${courses.length}, Users: ${totalUsers}, Requests: ${totalRequests}`);
  await mongoose.disconnect();
}

main().catch(console.error);
