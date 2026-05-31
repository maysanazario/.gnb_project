const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI não foi definido no .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Conectado ao MongoDB (collection wishlist)')
  } catch (error) {
    console.error('Falha ao conectar no MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
