import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as coverLetterApi from '@/apis/cover-letter.api';
import { getErrorMessage } from '@/lib/utils';
import type { 
  CoverLetter, 
  SaveCoverLetterData, 
  CoverLetterPersonalInfo as PersonalInfo, 
  CoverLetterEmployerInfo as EmployerInfo, 
  CoverLetterBodyContent as BodyContent 
} from '@/types/cover-letter';

export type { PersonalInfo, EmployerInfo, BodyContent };

export interface CoverLetterState {
  personalInfo: PersonalInfo;
  employerInfo: EmployerInfo;
  date: string;
  salutation: string;
  mode: "structured" | "manual";
  body: BodyContent;
  manualContent: string;
  signOff: string;
  template: string;
  
  // Backend integration state
  coverLettersList: CoverLetter[];
  currentId: string | null;
  title: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CoverLetterState = {
  personalInfo: {
    fullName: "",
    address: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
  },
  employerInfo: {
    managerName: "",
    teamName: "",
    companyName: "",
  },
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  salutation: "",
  mode: "structured",
  body: {
    intro: "",
    body1: "",
    body2: "",
    body3: "",
    conclusion: "",
  },
  manualContent: "",
  signOff: "",
  template: "Modern",
  coverLettersList: [],
  currentId: null,
  title: "Untitled Cover Letter",
  isLoading: false,
  error: null,
};

export const fetchAllCoverLetters = createAsyncThunk(
  'coverLetter/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await coverLetterApi.getAllCoverLetters();
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch cover letters'));
    }
  }
);

export const fetchCoverLetterById = createAsyncThunk(
  'coverLetter/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await coverLetterApi.getCoverLetterById(id);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch cover letter'));
    }
  }
);

export const saveCoverLetter = createAsyncThunk(
  'coverLetter/save',
  async ({ id, data }: { id?: string; data: SaveCoverLetterData }, { rejectWithValue }) => {
    try {
      if (id) {
        const response = await coverLetterApi.updateCoverLetter(id, data);
        return response;
      } else {
        const response = await coverLetterApi.createCoverLetter(data);
        return response;
      }
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to save cover letter'));
    }
  }
);

export const deleteCoverLetterById = createAsyncThunk(
  'coverLetter/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await coverLetterApi.deleteCoverLetter(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete cover letter'));
    }
  }
);

export const coverLetterSlice = createSlice({
  name: 'coverLetter',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    updateEmployerInfo: (state, action: PayloadAction<Partial<EmployerInfo>>) => {
      state.employerInfo = { ...state.employerInfo, ...action.payload };
    },
    updateDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    updateSalutation: (state, action: PayloadAction<string>) => {
      state.salutation = action.payload;
    },
    updateMode: (state, action: PayloadAction<"structured" | "manual">) => {
      state.mode = action.payload;
    },
    updateBody: (state, action: PayloadAction<Partial<BodyContent>>) => {
      state.body = { ...state.body, ...action.payload };
    },
    updateManualContent: (state, action: PayloadAction<string>) => {
      state.manualContent = action.payload;
    },
    updateSignOff: (state, action: PayloadAction<string>) => {
      state.signOff = action.payload;
    },
    updateTemplate: (state, action: PayloadAction<string>) => {
      state.template = action.payload;
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    resetCoverLetterEditor: (state) => {
      const { coverLettersList, ...rest } = initialState;
      return { ...rest, coverLettersList: state.coverLettersList };
    },
    setCurrentId: (state, action: PayloadAction<string | null>) => {
      state.currentId = action.payload;
    },
    updateCoverLetterState: (state, action: PayloadAction<any>) => {
      if (action.payload.personalInfo) state.personalInfo = { ...state.personalInfo, ...action.payload.personalInfo };
      if (action.payload.employerInfo) state.employerInfo = { ...state.employerInfo, ...action.payload.employerInfo };
      if (action.payload.date !== undefined) state.date = action.payload.date;
      if (action.payload.salutation !== undefined) state.salutation = action.payload.salutation;
      if (action.payload.mode !== undefined) state.mode = action.payload.mode;
      if (action.payload.body) state.body = { ...state.body, ...action.payload.body };
      if (action.payload.manualContent !== undefined) state.manualContent = action.payload.manualContent;
      if (action.payload.signOff !== undefined) state.signOff = action.payload.signOff;
      if (action.payload.template !== undefined) state.template = action.payload.template;
      if (action.payload.title !== undefined) state.title = action.payload.title;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCoverLetters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCoverLetters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coverLettersList = action.payload;
      })
      .addCase(fetchAllCoverLetters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCoverLetterById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCoverLetterById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentId = action.payload.id;
        state.title = action.payload.title;
        state.template = action.payload.template || "Modern";
        if (action.payload.content) {
          const content = action.payload.content;
          state.personalInfo = content.personalInfo || state.personalInfo;
          state.employerInfo = content.employerInfo || state.employerInfo;
          state.date = content.date || state.date;
          state.salutation = content.salutation || state.salutation;
          state.mode = content.mode || state.mode;
          state.body = content.body || state.body;
          state.manualContent = content.manualContent || state.manualContent;
          state.signOff = content.signOff || state.signOff;
        }
      })
      .addCase(fetchCoverLetterById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveCoverLetter.fulfilled, (state, action) => {
        state.currentId = action.payload.id;
        state.title = action.payload.title;
        const index = state.coverLettersList.findIndex(cl => cl.id === action.payload.id);
        if (index !== -1) {
          state.coverLettersList[index] = action.payload;
        } else {
          state.coverLettersList.unshift(action.payload);
        }
      })
      .addCase(deleteCoverLetterById.fulfilled, (state, action) => {
        state.coverLettersList = state.coverLettersList.filter(cl => cl.id !== action.payload);
        if (state.currentId === action.payload) {
          state.currentId = null;
        }
      });
  }
});

export const {
  updatePersonalInfo,
  updateEmployerInfo,
  updateDate,
  updateSalutation,
  updateMode,
  updateBody,
  updateManualContent,
  updateSignOff,
  updateTemplate,
  updateTitle,
  resetCoverLetterEditor,
  setCurrentId,
  updateCoverLetterState
} = coverLetterSlice.actions;

export default coverLetterSlice.reducer;
