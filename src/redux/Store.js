import { configureStore } from '@reduxjs/toolkit';
import widgetReducer from './WidgetSlice';

const store = configureStore({
    reducer: {
        widgets: widgetReducer,
    },
});

export default store;

