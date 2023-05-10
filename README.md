# buggy-ratting-playwright

## Run the automated tests

#### Setup
`git clone https://buggy-ratting-playwright.git`   # clone

`cd buggy-ratting-playwright`  # go to project folder

`npm install`   # install dependencies

#### Run the tests with UI Mode 
`npx playwright test --ui` 
#### Or run the tests in command-line
`npx playwright test` 

## Critical bugs found

#### Bug-1 Unable to load model detail page in Safari or Firefox due to vertical line in the link

>  Steps:

1.  Open Safari or Firefox and navigate to home page - [https://buggy.justtestit.org](https://buggy.justtestit.org)
2.  Click the card in the middle for the most Popular Model to open the model detail page

> Expected:

Model detail page is loaded

> Actual:

Unable to load the details of the page due to vertical line in the URL 

> Note:

In Chrome the vertical line in the URL can be converted to “%7C” automatically so the request can be successfully sent, however not all the browser or device can do the same so need to avoid using | divider in the url



#### Bug-2 Sorting by rank doesn’t work right in overall rating page

> Steps:

1.  Go to overall rating page - [https://buggy.justtestit.org/overall](https://buggy.justtestit.org/overall)    
2.  Click Rank to sort the list by rank   

> Expected:

Rank gets sorted as 1,2,3,4..

> Actual:

Rank gets sorted as 1,10,11,12...19, 2, 20, 21…


#### Bug-3 Author is missing for the model which has more than 100 comments in the response payload
> Steps:

1. View this model https://buggy.justtestit.org/model/c0bm09jgagshpkqbsuq0%7Cc0bm09jgagshpkqbsuqg and view the comment section
> Expected:

Author of each commet is listed

> Actual:

Auther is missing for every comment 

> Note

This occurs for every model detail page which contains a large number of comments and the response has to divide the comment into [0-99], [100-199]...and then all the user in it will be `user: ""`


## Other issues found

#### Sorting
1. In Make detial page `e.g. https://buggy.justtestit.org/make/c0bm09bgagshpkqbsuag`, the Mode or Rank doesn't call any function to sort it in any order, and
2. Votes will call `c0bm09bgagshpkqbsuag?modelsPage=1&modelsOrderBy=random`which will sort it by vote count in random order.

#### Navigating
1. Logout button doesn't work when it's on the overall rating page `https://buggy.justtestit.org/overall`
2. Unable to get back to home page by clicking "Buggy Rating" in the upper left from any of the Make detial page `e.g. https://buggy.justtestit.org/make/c0bm09bgagshpkqbsuag` as it's `href="/broken"`
3. The link for twitter in the lower right conner of overall rating page is broken as `href="https://www.twitter-broken.com/">`

#### Validation
1. Profile page, it doesn't validate if age input is not an integer e.g. `35.5` or `30+5`
2. It validate the length of comment, address and phone but doesn't tell the limit.
3. Error message for password validation is not user friendly `e.g. InvalidParameter: 1 validation error(s) found. - minimum field size of 6, ChangePasswordInput.PreviousPassword.`

#### Pagination
1. No pagination or "load more" for the comments.
2. The Next page button doesn't get disabled even if it's alreay page 6 of 5.

#### Content
1. The Max Speed for a Lamborghini shouldn't be 25km/h


## Test appoach


#### Manual testing phase

 1. Explore the web app from home page and top bar and observe the
    changes in the url to get rough idea about the hierarchy of the
    pages and put it into a mindmap.    
 2. For each kind of the pages, try the functionalities with valid data and prioritize them in the mindmap.
 3. Try with various data and actions to try to break it.
 4. Start with the high priority functions like voting and ranking, observe the communication between frontend and backend with inspect panel opened
    in Chrome to figure out how those key requests work.
 5. Open postman to try the APIs for a better understanding of the authrorization and payloads for later use in automation.
 6. Try the app in more browsers like Safari or Firefox and with the mobile.
 7. Take notes for issues found.  

#### Automation phase

 - Automate the main workflow from sign-in, open a model detail page, all the way to comment and vote with hard-coded test data. 
 - Add assertions and improve the stability.
 - Create a few functions to generate test data like user and comments.
 - Create a few functions on API level for sign-up, sign-in and voting for better stability and performance.
 - Organzie the functions with page object mode for a better readibility and maintenance.
 - Organize the tests with hooks and make sure the independency of each tests.
