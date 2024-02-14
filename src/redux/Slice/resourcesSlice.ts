import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import {
  Resources, CreateResources as CreateResource, GetElementsByAction, CreateResourcesAction,
  CreateResourcesElements, FetchResElCommands
} from "../Services/resources";
export interface ResourceAction {
  id: string;
  name: string;
  description: string;
  type: string;
  CreatedAt: string;
  UpdatedAt: string;

}
export interface ResourceActionPayload {
  actions: ResourceAction[];
  id: string | undefined;
}

export interface ResourceElementPayload {
  elements: ResourceAction[];
  id: string | undefined;
}
export interface ResourceElement {
  id: string;
  name: string;
  description: string;
  locator: string;
  type: string;
  CreatedAt: string;
  UpdatedAt: string;
}
export interface Resource {
  id: number;
  name: string;
  type: string;
  CreatedAt: string;
  UpdatedAt: string;
  actions: Array<ResourceAction>;
  elements: Array<ResourceElement>;
}
export interface ResourcesState {
  loading: boolean;
  resources: Array<Resource>;
  selectedResources: Resource | any;
  error: string | undefined;
  selectedActionElements: Resource | any;
  commands: Array<any>
}
const initialState: ResourcesState = {
  loading: false,
  resources: [],
  selectedResources: {},
  error: undefined,
  selectedActionElements: {},
  commands: []
};
export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => Resources(projectId, searchTerm)
);

export const createResource = createAsyncThunk(
  "resources/createResource",
  async ({projectId,resource}:{projectId:number,resource: Resource}) => CreateResource(projectId,resource)
);

export const getElementsByAction = createAsyncThunk(
  "resources/getElementsByAction",
  async (id: string) => GetElementsByAction(id)
);

export const createResourceAction = createAsyncThunk(
  "resources/createResourceAction",
  async ({resourceId,resourceAction}:{resourceId:number,resourceAction: ResourceActionPayload}) => CreateResourcesAction(resourceId,resourceAction)
);

export const createResourcesElement = createAsyncThunk(
  "resources/createResourcesElement",
  async ({resourceId,resourceElement}:{resourceId:number,resourceElement: ResourceElementPayload}) => CreateResourcesElements(resourceId,resourceElement)
);

export const fetchResElCommands = createAsyncThunk(
  "resources/fetchResElCommands",
  async () => FetchResElCommands()
);

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchResources.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchResources.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.resources = payload.data;
      console.log("payload.data[0]", payload.data[0]);
      if (payload.data.length) {
        state.selectedResources = payload.data[0];
      }
    });
    builder.addCase(fetchResources.rejected, (state, action) => {
      state.loading = false;
      state.resources = [];
      state.error = action.error.message;
    });

    builder.addCase(createResource.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createResource.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.resources = [...state.resources, payload.data];
      if (payload.data.length) {
        state.selectedResources = payload.data[0];
      }
    });
    builder.addCase(createResource.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(getElementsByAction.pending, (state) => {
      state.loading = true;
      state.selectedActionElements = {}
    });
    builder.addCase(getElementsByAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedActionElements = payload.data;
    });
    builder.addCase(getElementsByAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(createResourceAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createResourceAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload && payload.data) {
        const updatedResource = payload.data;
        const index = state.resources.findIndex(resource => resource.id === updatedResource.resource_id);

        if (index !== -1) {
          state.resources[index].actions.push(updatedResource);
          state.selectedResources = state.resources[index];
        }
      }
    });

    builder.addCase(createResourceAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(createResourcesElement.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createResourcesElement.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload && payload.data) {
        const updatedResource = payload.data;
        const index = state.resources.findIndex(resource => resource.id === updatedResource.resource_id);

        if (index !== -1) {
          state.resources[index].elements.push(updatedResource);
          state.selectedResources = state.resources[index];
        }
      }
    });

    builder.addCase(createResourcesElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchResElCommands.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchResElCommands.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload && payload.data) {
        state.commands = payload.data
      }
    });

    builder.addCase(fetchResElCommands.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  },
  reducers: {
    removeUserFromList: (state, action) => { },
    selectResources: (state, action) => {
      state.selectedResources = action.payload;
    },

    reOrderActionElement: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const selectedAction = { ...state.selectedActionElements }
      if (selectedAction) {
        const arrayToReorder = selectedAction.elemAction;
        const updatedArray = [...arrayToReorder];
        const [movedItem] = updatedArray.splice(fromIndex, 1);
        updatedArray.splice(toIndex, 0, movedItem);
        selectedAction.elemAction = updatedArray;
        state.selectedActionElements = selectedAction
      }
    },

    addResElemToResActElem: (state, action) => {
      const { item } = action.payload;
      const { elemAction } = state.selectedActionElements;
      const updatedElemAction = [...elemAction, item];

      state.selectedActionElements = {
        ...state.selectedActionElements,
        elemAction: updatedElemAction,
      };
    },

    removeElementFromAction: (state, action) => {
      const { id } = action.payload;
      const updatedElements = state.selectedActionElements.elemAction.filter(
        (element: any) => element.id !== id
      );

      state.selectedActionElements = {
        ...state.selectedActionElements,
        elemAction: updatedElements,
      };
    },

    reOrderResource: (state, action) => {
      const { fromIndex, toIndex, type } = action.payload;
      const selectedRes = { ...state.selectedResources }
      if (selectedRes) {
        const arrayToReorder = type === 'ACTION' ? selectedRes.actions : selectedRes.elements;
        const updatedArray = [...arrayToReorder];
        const [movedItem] = updatedArray.splice(fromIndex, 1);
        updatedArray.splice(toIndex, 0, movedItem);
        if (type === 'ACTION') {
          selectedRes.actions = updatedArray;
        } else {
          selectedRes.elements = updatedArray;
        }
        state.selectedResources = selectedRes
      }
    }
  },
});

export const { selectResources, reOrderResource, reOrderActionElement, addResElemToResActElem, removeElementFromAction } = resourcesSlice.actions;
export const resourcesSelector = (state: RootState) => state.resources;
export default resourcesSlice.reducer;
