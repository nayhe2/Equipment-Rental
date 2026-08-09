import '../App.css'

interface HomeProps {
  onLogout: () => void;
}

function Home({ onLogout }: HomeProps) {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={onLogout}>Wyloguj</button>
    </div>
  )
}

export default Home