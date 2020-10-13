# js-dom manipulation & timing

Live version: http://grubby-change.surge.sh/

I decided right away to make a quiz app that gives the user a limited time to answer each question and keep the scale small with only 10 questions. Initially I tried using radio buttons for the available answers but it became kind of a hastle linking the radio button labels and the button itself to a matching value so I just used regular buttons instead.

## How it works
The app has a list questions and each question has a type property. Every time a new question is displayed the answer is placed in a random button. Then the two extra buttons are filled with random values from an answer list with a matching type to the question. In this current version I have a list of 10 questions where the 5 questions are about countries while the second half is about heights, lengths and distances. The idea behind it is to be able to create a list of questions of a specific type and not always seeing the correct answer in the same position.

It could definitely use more lists of questions but I guess this is enough to see the functionality.