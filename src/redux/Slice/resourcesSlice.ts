import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import {
  Resources, CreateResources as CreateResource, GetElementsByAction, SaveElementsInAction, CreateResourcesAction,
  CreateResourcesElements, FetchResElCommands, UpdateResourcesAction, UpdateResource, UpdateResourcesElements,
  DeleteResource, DeleteAction, DeleteElement, FetchResElEvents,FetchResourceTypes
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
interface ResourceTypes {
  [key: string]: ResourceType;
}
type ResourceType = {
  read_only: boolean,
  applicable_elements: string[]
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
  events: Array<any>
  resourceTypes: undefined | ResourceTypes
}
const initialState: ResourcesState = {
  loading: false,
  resources: [],
  selectedResources: {},
  error: undefined,
  selectedActionElements: {},
  commands: [],
  events: [],
  resourceTypes: undefined
};
export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async ({ projectId, searchTerm }: { projectId: number, searchTerm: string }) => Resources(projectId, searchTerm)
);

export const createResource = createAsyncThunk(
  "resources/createResource",
  async ({ projectId, resource }: { projectId: number, resource: Resource }) => CreateResource(projectId, resource)
);

export const updateResource = createAsyncThunk(
  "resources/updateResource",
  async ({ resource, resourceId }: { resource: ResourceActionPayload, resourceId: number }) => UpdateResource(resource, resourceId)
);

export const deleteResource = createAsyncThunk(
  "resources/deleteResource",
  async ({ id }: { id: number }) => DeleteResource(id)
);

export const getElementsByAction = createAsyncThunk(
  "resources/getElementsByAction",
  async (id: string) => GetElementsByAction(id)
);

export const createResourceAction = createAsyncThunk(
  "resources/createResourceAction",
  async ({ resourceId, resourceAction }: { resourceId: number, resourceAction: ResourceActionPayload }) => CreateResourcesAction(resourceId, resourceAction)
);

export const updateResourceAction = createAsyncThunk(
  "resources/updateResourceAction",
  async ({ resourceAction, resourceId, actionId }: { resourceAction: ResourceActionPayload, resourceId: number, actionId: number }) => UpdateResourcesAction(resourceAction, resourceId, actionId)
);

export const saveSelectedActionChanges = createAsyncThunk(
  "resources/saveSelectedActionChanges",
  async ({ id, data }: { id: String, data: any }) => SaveElementsInAction(id, data)
)

export const deleteAction = createAsyncThunk(
  "resources/deleteAction",
  async ({ id }: { id: number }) => DeleteAction(id)
);

export const createResourcesElement = createAsyncThunk(
  "resources/createResourcesElement",
  async ({ resourceId, resourceElement }: { resourceId: number, resourceElement: ResourceElementPayload }) => CreateResourcesElements(resourceId, resourceElement)
);

export const updateResourcesElement = createAsyncThunk(
  "resources/updateResourcesElement",
  async ({ element }: { element: ResourceElementPayload }) => UpdateResourcesElements(element)
);

export const deleteElement = createAsyncThunk(
  "resources/deleteElement",
  async ({ id }: { id: number }) => DeleteElement(id)
);

export const fetchResElCommands = createAsyncThunk(
  "resources/fetchResElCommands",
  async () => FetchResElCommands()
);
export const fetchResElEvents = createAsyncThunk(
  "resources/fetchResElEvents",
  async () => FetchResElEvents()
);export const fetchResourceTypes = createAsyncThunk(
  "resources/fetchResourceTypes",
  async () => FetchResourceTypes()
);



const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchResources.pending, (state) => {
      state.loading = true;
      state.resources = [];
      state.selectedActionElements = {};
      state.selectedResources = {}
    });
    builder.addCase(fetchResources.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.resources = payload.data;
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

    builder.addCase(fetchResElEvents.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchResElEvents.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload && payload.data) {
        state.events = payload.data
      }
    });

    builder.addCase(fetchResElEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchResourceTypes.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchResourceTypes.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload && payload.data) {
        state.resourceTypes = payload.data
      }
    });

    builder.addCase(fetchResourceTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(updateResourceAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateResourceAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload && payload.data) {
        const updatedActions = state.selectedResources.actions.map((action: any) => {
          return action.id === payload.data.id ? payload.data : action;
        });
        state.selectedResources.actions = updatedActions;

        state.resources = state.resources.map(resource => {
          if (resource.id === state.selectedResources.id) {
            return { ...state.selectedResources, actions: updatedActions };
          }
          return resource;
        });
      }
    });

    builder.addCase(updateResourceAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(updateResource.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateResource.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload && payload.data) {
        state.selectedResources = payload.data;

        state.resources = state.resources.map(resource => {
          if (resource.id === state.selectedResources.id) {
            return { ...state.selectedResources };
          }
          return resource;
        });
      }
    });

    builder.addCase(updateResource.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteElement.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteElement.fulfilled, (state, { payload }) => {
      state.loading = false;

      const updatedElements = state.selectedResources.elements.filter((elm: any) => elm.id !== payload.data.id);
      state.selectedResources = {
        ...state.selectedResources,
        elements: updatedElements
      }

      const updatedResources = state.resources.map((resource: any) => {
        if (resource.id === state.selectedResources.id) {
          return {
            ...resource,
            elements: updatedElements
          };
        }
        return resource;
      });
      state.resources = updatedResources;
    });

    builder.addCase(deleteElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteAction.fulfilled, (state, { payload }) => {
      state.loading = false;

      const updatedActions = state.selectedResources.actions.filter((act: any) => act.id !== payload.data.id);
      state.selectedResources = {
        ...state.selectedResources,
        actions: updatedActions
      }

      const updatedResources = state.resources.map((resource: any) => {
        if (resource.id === state.selectedResources.id) {
          return {
            ...resource,
            actions: updatedActions
          };
        }
        return resource;
      });
      state.resources = updatedResources;
    });

    builder.addCase(deleteAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteResource.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteResource.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.resources = state.resources.filter((item) => item.id !== payload.data.id)
    });

    builder.addCase(deleteResource.rejected, (state, action) => {
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
        const arrayToReorder = selectedAction.element_actions;
        let updatedArray = [...arrayToReorder];
        const [movedItem] = updatedArray.splice(fromIndex, 1);
        updatedArray.splice(toIndex, 0, movedItem);
        updatedArray = updatedArray.map((item: any, index: number) => {
          return { ...item, sequence_number: index + 1 }
        })
        selectedAction.element_actions = updatedArray;
        state.selectedActionElements = selectedAction
      }
    },

    addResElemToResActElem: (state, action) => {
      const { item, command } = action.payload;
      let { element_actions } = state.selectedActionElements;

      element_actions = element_actions ? element_actions : []

      const updatedElemAction = [...element_actions, { element_id: item.id, name: item.name, sequence_number: element_actions.length + 1, type: item.type, command_id: command.id, assertion: "equal", data_source: "", timeout: "" , event_id:0}];

      state.selectedActionElements = {
        ...state.selectedActionElements,
        element_actions: updatedElemAction,
      };
    },

    removeElementFromAction: (state, action) => {
      const { id, sequence_number } = action.payload;
      const updatedElements = state.selectedActionElements.element_actions.filter(
        (element: any) => !(element.element_id == id && element.sequence_number == sequence_number)
      );

      state.selectedActionElements = {
        ...state.selectedActionElements,
        element_actions: updatedElements,
      };
    },

    updateSelectedActionElements: (state, action) => {
      state.selectedActionElements = {
        ...state.selectedActionElements,
        element_actions: action.payload
      }
    }

  },
});

export const { selectResources, reOrderActionElement, addResElemToResActElem, removeElementFromAction, updateSelectedActionElements } = resourcesSlice.actions;
export const resourcesSelector = (state: RootState) => state.resources;
export default resourcesSlice.reducer;
