const { io } = require('socket.io-client')

// Token dari localStorage (copy dari browser)
const token = process.argv[2]

if (!token) {
  console.log('❌ Usage: node test-socket-with-token.js <token>')
  console.log('📝 Copy token from browser localStorage.getItem("auth_token")')
  process.exit(1)
}

console.log('🔍 Testing Socket.IO server connection with token...')
console.log('🔑 Token:', token.substring(0, 20) + '...')

const testSocket = io('http://31.97.61.121:3032', {
  path: '/realtime',
  auth: {
    token: token
  },
  transports: ['websocket', 'polling'],
  timeout: 10000,
  forceNew: true,
})

testSocket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server with token!')
  console.log('🔌 Socket ID:', testSocket.id)
  console.log('🔌 Transport:', testSocket.io.engine.transport.name)
  
  // Test emit event
  console.log('📤 Emitting test event...')
  testSocket.emit('test', { message: 'Hello from test script!' })
  
  setTimeout(() => {
    testSocket.disconnect()
    process.exit(0)
  }, 3000)
})

testSocket.on('connect_error', (error) => {
  console.log('❌ Connection error:', error.message)
  
  if (error.message.includes('unauthorized')) {
    console.log('🔐 Token invalid or expired')
  } else {
    console.log('❌ Server connection failed:', error.message)
  }
  
  testSocket.disconnect()
  process.exit(1)
})

testSocket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason)
})

testSocket.on('test_response', (data) => {
  console.log('📥 Received test response:', data)
})

// Timeout after 15 seconds
setTimeout(() => {
  console.log('⏰ Connection timeout')
  testSocket.disconnect()
  process.exit(1)
}, 15000)
