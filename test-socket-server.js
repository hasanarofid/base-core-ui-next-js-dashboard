const { io } = require('socket.io-client')

console.log('🔍 Testing Socket.IO server connection...')

// Test connection without authentication first
const testSocket = io('http://31.97.61.121:3032', {
  path: '/realtime',
  transports: ['websocket', 'polling'],
  timeout: 5000,
  forceNew: true,
})

testSocket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server without auth!')
  console.log('🔌 Socket ID:', testSocket.id)
  console.log('🔌 Transport:', testSocket.io.engine.transport.name)
  testSocket.disconnect()
  process.exit(0)
})

testSocket.on('connect_error', (error) => {
  console.log('❌ Connection error:', error.message)
  
  if (error.message.includes('unauthorized')) {
    console.log('🔐 Server requires authentication - this is expected')
    console.log('✅ Server is running and accessible')
  } else {
    console.log('❌ Server connection failed:', error.message)
  }
  
  testSocket.disconnect()
  process.exit(1)
})

testSocket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason)
})

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Connection timeout')
  testSocket.disconnect()
  process.exit(1)
}, 10000)
