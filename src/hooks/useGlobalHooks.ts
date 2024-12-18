import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../app/store';

export default function useGlobalHooks() {
  const navigate = useNavigate();
  const dispatch: AppDispatch  = useDispatch();

  return {
    navigate,
    dispatch,
  }
}

