import print_text from shared.utls

def handler(event, _):
    print_text(event)
    return json.dumps({ 'hello': 'world' })
