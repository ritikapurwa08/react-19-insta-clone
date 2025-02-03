import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useMutationHook } from "./user-mutation";

export const useCreatePost = () => {
  const createPost = useMutation(api.posts.createPost);
  return useMutationHook(createPost);
};

export const useUpdatePost = () => {
  const updatePost = useMutation(api.posts.updatePost);
  return useMutationHook(updatePost);
};

export const useRemovePost = () => {
  const removePost = useMutation(api.posts.removePost);
  return useMutationHook(removePost);
};

export const useLikePost = () => {
  const likePost = useMutation(api.posts.likePost);
  return useMutationHook(likePost);
};

export const useSavePost = () => {
  const savePost = useMutation(api.posts.savePost);
  return useMutationHook(savePost);
};

export const useUnlikePost = () => {
  const unlikePost = useMutation(api.posts.unlikePost);
  return useMutationHook(unlikePost);
};
export const useUnsavePost = () => {
  const unsavePost = useMutation(api.posts.unsavePost);
  return useMutationHook(unsavePost);
};

export const useCreateComment = () => {
  const createComment = useMutation(api.posts.addComment);
  return useMutationHook(createComment);
};

export const useUpdateComment = () => {
  const updateComment = useMutation(api.posts.updateComment);
  return useMutationHook(updateComment);
};

export const useRemoveComment = () => {
  const removeComment = useMutation(api.posts.removeComment);
  return useMutationHook(removeComment);
};
