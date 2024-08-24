import { createSlice } from '@reduxjs/toolkit';

const widgetSlice = createSlice({
    name: 'widgets',
    initialState: {
        categories: [],
        searchTerm: '',
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        addWidget: (state, action) => {
            const { categoryName, widget } = action.payload;
            const category = state.categories.find(c => c.name === categoryName);
            if (category) {
                category.widgets.push(widget);
            }
        },
        removeWidget: (state, action) => {
            const { categoryName, widgetTitle } = action.payload;
            const category = state.categories.find(c => c.name === categoryName);
            if (category) {
                category.widgets = category.widgets.filter(w => w.title !== widgetTitle);
            }
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
});

export const { setCategories, addWidget, removeWidget, setSearchTerm } = widgetSlice.actions;

export default widgetSlice.reducer;
