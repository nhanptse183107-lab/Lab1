import { useState } from 'react'
import './App.css'

const lessons = [
  {
    id: '1',
    title: 'Japanese Sentence Patterns for JLPT N5',
    image: 'https://m.media-amazon.com/images/I/81gfrrHoS3L._SY466_.jpg',
    level: 'N5',
    completed: false,
    time: 4500,
  },
  {
    id: '2',
    title: 'Japanese Kanji Made Easy',
    image: 'https://m.media-amazon.com/images/I/71LR2H4NUbL._SY385_.jpg',
    level: 'N5',
    completed: false,
    time: 4000,
  },
  {
    id: '3',
    title: 'MASTER LISTENING JAPANESE LANGUAGE PROFICIENCY TEST N4',
    image: 'https://m.media-amazon.com/images/I/71WT2ufrDDL._SY425_.jpg',
    level: 'N4',
    completed: true,
    time: 6000,
  },
  {
    id: '4',
    title: '1500 JAPANESE VOCABULARY WORDS FOR THE JLPT LEVEL 4',
    image: 'https://m.media-amazon.com/images/I/71TQ+dI3qjL._SY466_.jpg',
    level: 'N4',
    completed: true,
    time: 5500,
  },
  {
    id: '5',
    title: 'SHIN NIHONGO 500 MON - JLPT N3',
    image: 'https://m.media-amazon.com/images/I/71YP7MMykNL._SY466_.jpg',
    level: 'N3',
    completed: true,
    time: 7000,
  },
  {
    id: '6',
    title: 'Try! Japanese Language Proficiency Test N3',
    image: 'https://m.media-amazon.com/images/I/710wWXgaHcL._SY425_.jpg',
    level: 'N3',
    completed: false,
    time: 5000,
  },
  {
    id: '7',
    title: '2500 Essential Vocabulary for the Jlpt N2',
    image: 'https://m.media-amazon.com/images/I/710hokXlHCL._SY466_.jpg',
    level: 'N2',
    completed: false,
    time: 6500,
  },
  {
    id: '8',
    title: 'Quick Mastery of Jlpt N2 Grammar: The Workbook for the Japanese Language Proficiency Test',
    image: 'https://m.media-amazon.com/images/I/81QKH-w3JfL._SY425_.jpg',
    level: 'N2',
    completed: false,
    time: 7500,
  },
  {
    id: '9',
    title: 'KANZEN MASTER GRAMMAR JAPANESE LANGUAGE PROFICIENCY TEST JLPT N1',
    image: 'https://m.media-amazon.com/images/I/91yErlDaDjL._SY425_.jpg',
    level: 'N1',
    completed: true,
    time: 9000,
  },
  {
    id: '10',
    title: 'Jlpt N1 Japanese Lauguage Proficiency Test Trial Examination',
    image: 'https://m.media-amazon.com/images/I/71Crqtp65IL._SY425_.jpg',
    level: 'N1',
    completed: false,
    time: 8500,
  },
]

const formatTime = (seconds) => `${Math.round(seconds / 60)} mins`

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <span className="brand">Lab1</span>
        <a href="#lessons">Home</a>
        <a className="active" href="#lessons">Lesson Management</a>
        <a href="#completed">Completed Lesson</a>
      </nav>
      <main className="content" id="lessons">
        <h1>Lab1 - All Available Lessons</h1>
        <div className="lesson-grid">
          {lessons.map((lesson) => (
            <article className="lesson-card" key={lesson.id}>
              <div className="cover-wrap"><img src={lesson.image} alt={lesson.title} /></div>
              <div className="lesson-info"><h2>{lesson.title}</h2><p><strong>Level:</strong> {lesson.level}</p><p><strong>Estimated Time:</strong> {formatTime(lesson.time)}</p><span className={`status ${lesson.completed ? 'completed' : ''}`}>{lesson.completed ? 'Completed' : 'Not Completed'}</span><button type="button" onClick={() => setSelected(lesson)}>View Detail</button></div>
            </article>
          ))}
        </div>
      </main>
      {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="close-button" type="button" onClick={() => setSelected(null)}>x</button><img src={selected.image} alt="" /><div><p className="modal-kicker">JLPT {selected.level}</p><h2>{selected.title}</h2><p>This lesson is estimated to take {formatTime(selected.time)}.</p></div></section></div>}
    </div>
  )
}

export default App
