import React from 'react'
import Avatar from 'react-avatar';


function Client({username}) {
  return (
    <div className='flex items-center'>
        <Avatar name={username} size={40} className='rounded-4xl'  />
        <span className='ml-2 text-sm font-thin'>
            {username}
        </span>
    </div>

  )
}

export default Client