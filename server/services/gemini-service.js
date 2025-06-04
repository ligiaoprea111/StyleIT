try {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text || result.response.text || '';
  console.log('Gemini API response:', response);
  return response;
} catch (error) {
  console.error('Gemini API error:', error);
  throw new Error('Gemini API error: ' + (error.message || error.toString()));
} 