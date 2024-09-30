import mongoose from 'mongoose'

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_DB_URL)
    .then((res) => console.log('DB connection success'))
    .catch((err) => console.log('DB connection Fail', err))
}
