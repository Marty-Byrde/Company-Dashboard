'use client'
import { Context, useContext } from 'react'

/**
 * Checks whether the requested context is valid and returns the context if it is
 * @param _context The requested context
 * @returns Depending on the validity of the context it returns the context-props or throws an error
 */
export default function useContextHandler<Props>(_context: Context<Props | null>): Props {
  const context = useContext(_context)
  if (!context) throw new Error('useContextHandler can only be used within the requested Context-Provider!')

  return context as Props
}
