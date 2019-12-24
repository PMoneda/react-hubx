import {Hubx} from './'

describe('PubSub', () => {
  it('should send and receive message using pubsub', async () => {
    const hub = new Hubx();
    var message_received = ""
    hub.attach("test-event",(message)=>{
      message_received = message
    })
    //you can wait for all observer be notified
    await hub.notify("test-event","hello world")
    expect(message_received).toBe("hello world")
  })

  it('should receive receive message from detached observer', async () => {
    const hub = new Hubx();
    var message_received = ""
    const observer = (message)=>{
      message_received = message
    };
    hub.attach("test-event",observer)
    hub.detach("test-event",observer)
    //you can wait for all observer be notified
    await hub.notify("test-event","hello world")
    expect(message_received).toBe("")
  })

  it('should send and receive message using pubsub from all observers', async () => {
    const hub = new Hubx();
    var message_received = []
    hub.attach("test-event",(message)=>{
      message_received.push(message)
    })
    hub.attach("test-event",(message)=>{
      message_received.push(message)
    })
    //you can wait for all observer be notified
    await hub.notify("test-event","hello world")
    expect(message_received.length).toBe(2)
  })
  

})

describe("Mediator",()=>{
  it('should send message using request mediator', async () => {
    const hub = new Hubx();
    hub.attachMediator("get-from-api",(name)=>{
      return new Promise((res)=>{
        res(`hello ${name}`)
      })
    })
    const resp = await hub.request("get-from-api","world");
    expect(resp[0]).toBe("hello world")    
  })
})
