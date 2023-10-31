import { useState } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import axios from 'axios'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [serverKeyMidtrans, setServerKeyMidtrans] = useState('')
  const [urlBackend, setUrlBackend] = useState('')
  const [name, setName] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'name') {
      setName(value)
    } else if (name === 'totalPrice') {
      setTotalPrice(value)
    } else if (name === 'serverKeyMidtrans') {
      setServerKeyMidtrans(value)
    } else if (name === 'urlBackend') {
      setUrlBackend(value)
    }
  }

  async function postDataNoAuth(url, payload) {
    try {
      return await axios.post(`${urlBackend}/${url}`, payload)
    } catch (error) {
      return {
        status: error.response.status,
        data: error.response.data
      }
    }
  }

  const handleReset = () => {
    setName('')
    setTotalPrice(0)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const payload = {
      server_key_midtrans: serverKeyMidtrans,
      name,
      total_price: totalPrice
    }
    try {
      const response = await postDataNoAuth('api/v1/get-link', payload)
      if (response.status === 200) {
        setLoading(false)
        handleReset()
        alert(`Link: \n ${response.data.data.redirect_url}`)
      }
      if (response.status === 400) {
        setLoading(false)
        handleReset()
        alert(response.data.message)
      }
    } catch (error) {
      setLoading(false)
      alert('Gagal Get Link')
    }
  }

  return (
    <>
      <div className='App'>
        <h2>Generate Link Pembayaran</h2>
        <Form className='form' onSubmit={handleSubmit}>
          <FormGroup>
            <Label for='idUrlBackend'>Alamat Server Backend</Label>
            <Input
              type='text'
              name='urlBackend'
              id='idUrlBackend'
              placeholder='Masukkan alamat server Backend'
              value={urlBackend}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for='idServerKeyMidtrans'>Server Key Midtrans</Label>
            <Input
              type='text'
              name='serverKeyMidtrans'
              id='idServerKeyMidtrans'
              placeholder='Masukkan server key Midtrans'
              value={serverKeyMidtrans}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for='idName'>Nama</Label>
            <Input
              type='text'
              name='name'
              id='idName'
              placeholder='Masukkan Nama'
              value={name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for='idTotalPrice'>Total Harga</Label>
            <Input
              type='number'
              name='totalPrice'
              id='idTotalPrice'
              value={totalPrice}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          {loading ? (
            <Button type='submit' disabled>
              Loading...
            </Button>
          ) : (
            <Button type='submit'>Generate Link</Button>
          )}
        </Form>
      </div>
    </>
  )
}

export default App
