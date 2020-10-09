import Alpaca from '@alpacahq/alpaca-trade-api'

let alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secretKey: process.env.APCA_API_SECRET_KEY,
  paper: false,
  usePolygon: true,
})

export default alpaca
