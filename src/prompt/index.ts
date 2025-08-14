const generate_commit_message_prompt = (
  commitMessage: string,
  diff: string,
) => {
  return `Answer me with the exact commit message without any explanation.
  Here is the diff of the staged changes: ${diff}
  Can you based on the above changes and the commit message: ${commitMessage}, write a short commit message?
  Answer me with the exact commit message without any explanation.`;
};

export { generate_commit_message_prompt };
