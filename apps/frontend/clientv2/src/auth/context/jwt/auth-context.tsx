'use client';

import { createContext } from 'react';

import { AuthTypes } from '../../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as AuthTypes);
