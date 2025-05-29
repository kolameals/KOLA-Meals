import { configureStore } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import subscriptionReducer from './slices/subscriptionSlice'
import deliveryPartnerReducer from './slices/deliveryPartnerSlice'
import mealReducer from './slices/mealSlice'
import rawMaterialReducer from './slices/rawMaterialSlice'
import recipeReducer from './slices/recipeSlice'
import productionReducer from './slices/productionSlice'
import menuReducer from './slices/menuSlice'
import analyticsReducer from './slices/analytics/analyticsSlice'
import inventoryReducer from './slices/inventorySlice'
import feedbackReducer from './slices/feedbackSlice'
import orderReducer from './slices/orderSlice'
import userManagementReducer from './slices/userManagementSlice'
import costReducer from './slices/costSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subscriptionReducer,
    deliveryPartner: deliveryPartnerReducer,
    meal: mealReducer,
    rawMaterials: rawMaterialReducer,
    recipes: recipeReducer,
    production: productionReducer,
    menu: menuReducer,
    analytics: analyticsReducer,
    inventory: inventoryReducer,
    feedback: feedbackReducer,
    orders: orderReducer,
    userManagement: userManagementReducer,
    costs: costReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector