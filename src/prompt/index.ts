const generate_system_prompt = () => {
  return `You are a helpful assistant that can generate commit messages based on the diff of the staged changes.
  `;
};

const generate_user_prompt = (git_diff: string, commit_message: string) => {
  return `Answer me with the exact commit message without any explanation.
  Here is the diff of the staged changes: ${git_diff}
  Can you based on the above changes and the commit message: ${commit_message}, write a short commit message?
  Answer me with the exact commit message without any explanation.`;
};

export { generate_system_prompt, generate_user_prompt };
