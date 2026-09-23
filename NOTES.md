# Notes



## Search vs Category filter



The DummyJSON API cannot search and filter by category at the same time. I decided that search takes priority: whenever a search query is present, it is used instead of the category filter. Selecting a category clears the search box, so the two never conflict. This keeps the behavior predictable for the user.



## Add / Edit / Delete not really persisting



The DummyJSON API does not actually save changes on its server - it returns a success response but does not store anything. To still give the user visible feedback, the app calls the API first (so the request and response shape is validated), and then updates the local React state directly, for example removing the deleted item from the list. This means changes are visible during the session but will disappear on a full page refresh, which is a known limitation of the fake API rather than a bug in the app.



## A problem I faced and how I fixed it



While building the edit product route, I ran into an issue where PowerShell treated the [id] folder name as a wildcard pattern instead of a literal folder name, so commands like "dir" and "notepad" could not find files inside it even though the files existed. I fixed this by using PowerShell's -LiteralPath parameter, which tells commands to treat the path as literal text instead of a pattern.



## Where AI helped



I used an AI assistant (Claude) to help scaffold the project structure, write the Axios interceptor setup, the debounce hook, and the URL-sync pagination logic, and to explain each part so I could understand and reproduce it. All code was reviewed, typed out, and tested by me locally before committing.

