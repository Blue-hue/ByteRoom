import React from 'react'
import Avatar from 'react-avatar'

function Client({ username }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
      <Avatar
        name={username}
        size="42"
        round={true}
        className="border border-gray-300 dark:border-gray-600"
      />
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
        {username}
      </span>
    </div>
  )
}

export default Client
