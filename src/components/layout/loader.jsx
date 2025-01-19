import React from 'react'

const loader = () => {
  return (
    <>
    <meta name="viewport" content=" initial-scale=1" />
  
    <div className="container">
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-grow text-warning" style={{ width: '5rem', height: '5rem' }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </>
  )
}

export default loader
