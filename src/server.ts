import mongoose from 'mongoose'
import { app } from './app'
import { env } from './config/env'

app.listen(env.PORT, () =>
  console.log(`✅ Server running at http://localhost:${env.PORT}`)
)

mongoose
  .connect(`${env.DB_URL}`, {
    dbName: env.DB_NAME,
    serverSelectionTimeoutMS: 2000,
  })
  .then(() => {
    console.log('✅ Mongoose connection was succesfully established!')
  })
  .catch(() => {
    console.log('❌ Cannot connect mongoose!')
  })

// Runs whenever the server starts
import './start'
import './cron'
