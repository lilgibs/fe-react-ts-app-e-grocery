import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function useGlobalHooks() {
  const navigate = useNavigate();

  return {
    navigate,
  }
}

