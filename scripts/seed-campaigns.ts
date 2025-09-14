import { execSync } from 'child_process';
import path from 'path';

console.log('🚀 Running campaign data seed...\n');

try {
  // Change to backend directory
  const backendPath = path.resolve(__dirname, '..');
  process.chdir(backendPath);
  
  console.log('📍 Working directory:', process.cwd());
  
  // Run the seed script
  execSync('npx tsx prisma/campaign-seed.ts', { 
    stdio: 'inherit',
    cwd: backendPath
  });
  
  console.log('\n✅ Campaign seed completed successfully!');
  console.log('\n📝 Now you can test the APIs using:');
  console.log('   1. VS Code REST Client with campaign_test_requests.http');
  console.log('   2. Postman or any HTTP client');
  console.log('   3. curl commands');
  console.log('\n🌐 Available endpoints:');
  console.log('   GET    /api/campaigns');
  console.log('   GET    /api/campaigns?status=ACTIVE');
  console.log('   POST   /api/campaigns');
  console.log('   POST   /api/campaigns/validate-voucher');
  console.log('   GET    /api/campaigns/code/{code}');
  console.log('   GET    /api/campaigns/{id}/stats');
  
} catch (error) {
  console.error('❌ Error running seed:', error);
  process.exit(1);
}