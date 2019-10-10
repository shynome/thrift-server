
import { createWebServer } from '../lib'
import { HelloSvc } from "../example/codegen";
import *as thrift from "thrift";

const server = createWebServer({
  services: {
    '/': {
      // @ts-ignore
      transport: thrift.TBufferedTransport, protocol: thrift.TJSONProtocol,
      processor: HelloSvc.Processor,
      handler: {
        echo: (ctx, name = 'world') => {
          return `echo ${ctx.whoami} ${name}`
        },
        echob: (ctx, name) => {
          return `echob ${ctx.whoami} ${name}`
        },
      } as HelloSvc.IHandler<{ whoami: string }>,
    }
  }
})

import { createServer } from "http";
const app = createServer((req, res) => {
  req.url = '/'
  // @ts-ignore
  req.whoami = req.headers['whoami']
  server.emit('request', req, res)
})

describe('webserver', () => {
  let port: number
  beforeAll(async () => {
    port = await new Promise<number>((rl, rj) => {
      let errCallback = (err: any) => {
        rj(err)
      }
      app
        .once('error', errCallback)
        .listen(function () {
          app.removeListener('error', errCallback)
          // @ts-ignore
          let port = this.address().port
          rl(port)
        })
    })
  })
  afterAll(async () => {
    await new Promise((rl, rj) => {
      app.close((err) => {
        if (err) {
          rj(err)
          return
        }
        rl()
      })
    })
  })
  it('echo', async () => {

    let whoami = 'echo-tester'
    let name = 'ddd'
    let connection = thrift.createHttpConnection('localhost', port, {
      transport: thrift.TBufferedTransport, protocol: thrift.TJSONProtocol,
      path: '/',
      headers: { whoami, }
    })
    let client = thrift.createHttpClient(HelloSvc, connection)

    let r1 = await client.echo()
    expect(r1).toBe(`echo ${whoami} world`)

    let r2 = await client.echo(name)
    expect(r2).toBe(`echo ${whoami} ${name}`)

  })
  it('echob', async () => {

    let whoami = 'echob-tester'
    let name = 'vvvvv'

    let connection = thrift.createHttpConnection('localhost', port, {
      transport: thrift.TBufferedTransport, protocol: thrift.TJSONProtocol,
      path: '/',
      headers: { whoami, }
    })
    let client = thrift.createHttpClient(HelloSvc, connection)

    let r1 = await client.echob(name)
    expect(r1).toBe(`echob ${whoami} ${name}`)

  })
})
