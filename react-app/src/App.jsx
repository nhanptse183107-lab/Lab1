import { useState } from 'react'
import lessonsData from './data/lessons.json'
import './App.css'

const normalizeLesson = (lesson) => ({
  id: String(lesson.id ?? Date.now()),
  title: lesson.lessonTitle ?? lesson.title ?? '',
  image: lesson.lessonImage ?? lesson.image ?? '',
  level: lesson.level ?? '',
  time: Number(lesson.estimatedTime ?? lesson.time ?? 0),
  completed: Boolean(lesson.isCompleted ?? lesson.completed ?? false),
})

const initialLessons = lessonsData.map(normalizeLesson)

const getEmptyForm = () => ({
  title: '',
  image: '',
  time: '',
  level: '',
  completed: false,
})

const formatTime = (minutes) => `${minutes} mins`

function App() {
  const [lessons, setLessons] = useState(() => initialLessons)
  const [activeTab, setActiveTab] = useState('home')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('add')
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [formData, setFormData] = useState(getEmptyForm())
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ type: 'success', message: '' })

  const visibleLessons = activeTab === 'completed'
    ? lessons.filter((lesson) => lesson.completed)
    : lessons

  const openAddModal = () => {
    setModalType('add')
    setEditingId(null)
    setFormData(getEmptyForm())
    setErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (lesson) => {
    setModalType('edit')
    setEditingId(lesson.id)
    setFormData({
      title: lesson.title,
      image: lesson.image,
      time: String(lesson.time),
      level: lesson.level,
      completed: lesson.completed,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setDeletingId(null)
    setSelectedLesson(null)
    setErrors({})
  }

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validateForm = () => {
    const nextErrors = {}
    const lessonTime = Number(formData.time)

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required.'
    }

    if (!formData.image.trim()) {
      nextErrors.image = 'Lesson image URL is required.'
    } else {
      try {
        const imageUrl = new URL(formData.image.trim())
        if (!['http:', 'https:'].includes(imageUrl.protocol)) {
          nextErrors.image = 'Please enter a valid image URL.'
        }
      } catch {
        nextErrors.image = 'Please enter a valid image URL.'
      }
    }

    if (!formData.time || !Number.isFinite(lessonTime) || lessonTime < 1) {
      nextErrors.time = 'Estimated time must be at least 1 minute.'
    }

    if (!['N5', 'N4', 'N3', 'N2', 'N1'].includes(formData.level)) {
      nextErrors.level = 'Please select a valid level.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const lessonPayload = {
      id: editingId || String(Date.now()),
      title: formData.title.trim(),
      image: formData.image.trim(),
      level: formData.level,
      time: Number(formData.time),
      completed: formData.completed,
    }

    if (modalType === 'edit' && editingId) {
      setLessons((current) =>
        current.map((lesson) => (lesson.id === editingId ? lessonPayload : lesson)),
      )
      setAlert({ type: 'success', message: 'Lesson updated successfully' })
    } else {
      setLessons((current) => [...current, lessonPayload])
      setAlert({ type: 'success', message: 'Lesson added successfully' })
    }

    closeModal()
  }

  const handleDelete = () => {
    if (!deletingId) {
      return
    }

    setLessons((current) => current.filter((lesson) => lesson.id !== deletingId))
    setAlert({ type: 'success', message: 'Lesson deleted successfully' })
    closeModal()
  }

  const toggleCompleted = (lessonId) => {
    const lesson = lessons.find((item) => item.id === lessonId)
    if (!lesson) {
      return
    }

    setLessons((current) =>
      current.map((item) =>
        item.id === lessonId ? { ...item, completed: !item.completed } : item,
      ),
    )
    setAlert({
      type: 'success',
      message: lesson.completed ? 'Lesson marked as not completed' : 'Lesson marked as completed',
    })
  }

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <a href="#home" className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</a>
        <a href="#management" className={activeTab === 'management' ? 'active' : ''} onClick={() => setActiveTab('management')}>Lesson Management</a>
        <a href="#completed" className={activeTab === 'completed' ? 'active' : ''} onClick={() => setActiveTab('completed')}>Completed Lesson</a>
      </nav>

      <main className="content" id={activeTab}>
        <div className="lesson-header">
          <h1 className="page-title">
            {activeTab === 'management' ? 'Lesson List' : activeTab === 'completed' ? 'Completed Lessons' : 'All Available Lessons'}
          </h1>
          {activeTab === 'management' && (
            <button type="button" className="add-button" onClick={openAddModal}>Add Lesson</button>
          )}
        </div>

        {activeTab === 'management' ? (
          <div className="table-wrap">
            <table className="lesson-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td>
                      <div className="action-stack">
                        <button type="button" className="action-button edit" onClick={() => openEditModal(lesson)}>Edit</button>
                        <button type="button" className="action-button delete" onClick={() => {
                          setDeletingId(lesson.id)
                          setModalType('delete')
                          setIsModalOpen(true)
                        }}>Delete</button>
                      </div>
                    </td>
                    <td>{lesson.title}</td>
                    <td><img className="lesson-image" src={lesson.image} alt={lesson.title} /></td>
                    <td>{lesson.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          visibleLessons.length > 0 ? (
            <div className="lesson-grid">
              {visibleLessons.map((lesson) => (
                <article className="lesson-card" key={lesson.id}>
                  <div className="lesson-cover-wrap">
                    <img src={lesson.image} alt={lesson.title} className="lesson-cover" />
                  </div>
                  <div className="lesson-card-body">
                    <h2>{lesson.title}</h2>
                    <p className="lesson-meta"><strong>Level:</strong> {lesson.level}</p>
                    <p className="lesson-meta"><strong>Estimated Time:</strong> {formatTime(lesson.time)}</p>
                    <span className={`status ${lesson.completed ? 'completed' : ''}`}>
                      {lesson.completed ? 'Completed' : 'Not Completed'}
                    </span>
                    <div className="lesson-actions">
                      <button type="button" className="card-action detail" onClick={() => setSelectedLesson(lesson)}>View Detail</button>
                      <button type="button" className="card-action toggle-completed" onClick={() => toggleCompleted(lesson.id)}>
                        {lesson.completed ? 'Mark incomplete' : 'Mark complete'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">No completed lessons yet. Mark a lesson as complete from Home.</p>
          )
        )}

        {alert.message && (
          <div className={`alert-banner ${alert.type}`} role="alert">
            {alert.message}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          {modalType === 'delete' ? (
            <div className="modal-card delete-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="close-button" onClick={closeModal} aria-label="Close">
                ×
              </button>
              <h3>Delete lesson</h3>
              <p className="delete-text">
                Are you sure you want to delete &quot;{lessons.find((lesson) => lesson.id === deletingId)?.title || 'this lesson'}&quot;? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="danger-button" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-card form-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="close-button" onClick={closeModal} aria-label="Close">
                ×
              </button>
              <h3>{modalType === 'edit' ? 'Edit Lesson' : 'Add Lesson'}</h3>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="title">Lesson title <span>*</span></label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleFieldChange}
                    className={errors.title ? 'invalid' : ''}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? 'title-error' : undefined}
                    placeholder="Enter lesson title"
                  />
                  {errors.title && <span className="error-text" id="title-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="image">Lesson image URL <span>*</span></label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleFieldChange}
                    className={errors.image ? 'invalid' : ''}
                    aria-invalid={Boolean(errors.image)}
                    aria-describedby={errors.image ? 'image-error' : undefined}
                    placeholder="Enter lesson image URL"
                  />
                  {errors.image && <span className="error-text" id="image-error">{errors.image}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">Lesson time (in minutes) <span>*</span></label>
                  <input
                    id="time"
                    name="time"
                    type="number"
                    min="1"
                    value={formData.time}
                    onChange={handleFieldChange}
                    className={errors.time ? 'invalid' : ''}
                    aria-invalid={Boolean(errors.time)}
                    aria-describedby={errors.time ? 'time-error' : undefined}
                    placeholder="0"
                  />
                  {errors.time && <span className="error-text" id="time-error">{errors.time}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="level">Level <span>*</span></label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleFieldChange}
                    className={errors.level ? 'invalid' : ''}
                    aria-invalid={Boolean(errors.level)}
                    aria-describedby={errors.level ? 'level-error' : undefined}
                  >
                    <option value="">Select level</option>
                    <option value="N5">N5</option>
                    <option value="N4">N4</option>
                    <option value="N3">N3</option>
                    <option value="N2">N2</option>
                    <option value="N1">N1</option>
                  </select>
                  {errors.level && <span className="error-text" id="level-error">{errors.level}</span>}
                </div>

                <label className="completion-checkbox">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={formData.completed}
                    onChange={handleFieldChange}
                  />
                  <span>Is complete</span>
                </label>

                <div className="modal-actions">
                  <button type="button" className="secondary-button" onClick={closeModal}>
                    Close
                  </button>
                  <button type="submit" className="primary-button">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
      {selectedLesson && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedLesson(null)}>
          <section className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setSelectedLesson(null)} aria-label="Close">×</button>
            <img src={selectedLesson.image} alt={selectedLesson.title} />
            <div className="detail-content">
              <p className="modal-kicker">JLPT {selectedLesson.level}</p>
              <h3 id="detail-title">{selectedLesson.title}</h3>
              <p>Estimated Time: {formatTime(selectedLesson.time)}</p>
              <p>Status: {selectedLesson.completed ? 'Completed' : 'Not Completed'}</p>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
