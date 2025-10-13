export function ContextMenu() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
      <button onClick={() => console.log('hello')}> Add new</button>
      <div>Test</div>
    </div>
  )
}
