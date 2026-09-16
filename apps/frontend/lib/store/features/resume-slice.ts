import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeApi } from '@/apis/resume.api';
import { getErrorMessage } from '@/lib/utils';
import type { Resume, SaveResumeData, ResumeData, EditorResumeContent } from '@/types/resume';

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  profession: string;
  image: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  is_current: boolean;
  _id?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduation_date: string;
  gpa: string;
  graduationType: "cgpa" | "percentage";
  _id?: string;
}

export interface Project {
  name: string;
  techStack: string;
  description: string;
  _id?: string;
}

export interface ResumeState {
  personalInfoData: PersonalInfo;
  professionalSummaryData: string;
  experienceData: Experience[];
  educationData: Education[];
  projectData: Project[];
  skillData: string[];
  template: string;
  accentColor: string;
  sectionVisibility: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
  };
  // Backend integration state
  resumesList: Resume[];
  currentResumeId: string | null;
  resumeTitle: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  personalInfoData: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    profession: "",
    image: "",
  },
  professionalSummaryData: "",
  experienceData: [],
  educationData: [],
  projectData: [],
  skillData: [],
  template: "professional",
  accentColor: "#4E61D3",
  sectionVisibility: {
    summary: true,
    experience: true,
    education: true,
    projects: true,
    skills: true,
  },
  resumesList: [],
  currentResumeId: null,
  resumeTitle: "Untitled Resume",
  isLoading: false,
  error: null,
};

export const fetchAllResumes = createAsyncThunk(
  'resume/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resumeApi.getAll();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch resumes'));
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resume/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeApi.getById(id);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch resume'));
    }
  }
);

export const saveResume = createAsyncThunk(
  'resume/save',
  async ({ id, data }: { id?: string; data: SaveResumeData }, { rejectWithValue }) => {
    try {
      if (id) {
        const response = await resumeApi.update(id, data);
        return response.data;
      } else {
        const response = await resumeApi.create(data);
        return response.data;
      }
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to save resume'));
    }
  }
);

export const createResumeVersion = createAsyncThunk(
  'resume/createVersion',
  async ({ id, data }: { id: string; data: { company: string; role: string; content: EditorResumeContent } }, { rejectWithValue }) => {
    try {
      const response = await resumeApi.createVersion(id, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to save version'));
    }
  }
);

export const deleteResumeById = createAsyncThunk(
  'resume/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await resumeApi.delete(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete resume'));
    }
  }
);

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setPersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
      state.personalInfoData = action.payload;
    },
    setProfessionalSummary: (state, action: PayloadAction<string>) => {
      state.professionalSummaryData = action.payload;
    },
    setExperience: (state, action: PayloadAction<Experience[]>) => {
      state.experienceData = action.payload;
    },
    setEducation: (state, action: PayloadAction<Education[]>) => {
      state.educationData = action.payload;
    },
    setProject: (state, action: PayloadAction<Project[]>) => {
      state.projectData = action.payload;
    },
    setSkill: (state, action: PayloadAction<string[]>) => {
      state.skillData = action.payload;
    },
    setTemplate: (state, action: PayloadAction<string>) => {
      state.template = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    setSectionVisibility: (state, action: PayloadAction<Partial<ResumeState["sectionVisibility"]>>) => {
      state.sectionVisibility = { ...state.sectionVisibility, ...action.payload };
    },
    updateResumeState: (state, action: PayloadAction<Partial<ResumeState>>) => {
      return { ...state, ...action.payload };
    },
    resetResumeEditor: (state) => {
      const { resumesList, ...rest } = initialState;
      return { ...rest, resumesList: state.resumesList };
    },
    setCurrentResumeId: (state, action: PayloadAction<string | null>) => {
      state.currentResumeId = action.payload;
    },
    setResumeTitle: (state, action: PayloadAction<string>) => {
      state.resumeTitle = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllResumes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumesList = action.payload;
      })
      .addCase(fetchAllResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchResumeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResumeId = action.payload.id;
        state.resumeTitle = action.payload.title;
        // Merge the content into the editor state
        if (action.payload.content) {
          const content = action.payload.content;
          state.personalInfoData = content.personalInfoData || state.personalInfoData;
          state.professionalSummaryData = content.professionalSummaryData || state.professionalSummaryData;
          state.experienceData = content.experienceData || state.experienceData;
          state.educationData = content.educationData || state.educationData;
          state.projectData = content.projectData || state.projectData;
          state.skillData = content.skillData || state.skillData;
          state.template = content.template || state.template;
          state.accentColor = content.accentColor || state.accentColor;
          state.sectionVisibility = content.sectionVisibility || state.sectionVisibility;
        }
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.currentResumeId = action.payload.id;
        state.resumeTitle = action.payload.title;
        // Update the list as well
        const index = state.resumesList.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.resumesList[index] = action.payload;
        } else {
          state.resumesList.unshift(action.payload);
        }
      })
      .addCase(deleteResumeById.fulfilled, (state, action) => {
        state.resumesList = state.resumesList.filter(r => r.id !== action.payload);
        if (state.currentResumeId === action.payload) {
          state.currentResumeId = null;
        }
      });
  }
});

export const {
  setPersonalInfo,
  setProfessionalSummary,
  setExperience,
  setEducation,
  setProject,
  setSkill,
  setTemplate,
  setAccentColor,
  setSectionVisibility,
  updateResumeState,
  resetResumeEditor,
  setCurrentResumeId,
  setResumeTitle
} = resumeSlice.actions;

export default resumeSlice.reducer;

