---
outline: deep
---

# Command Line Usage


Rhyme comes with a command-line tool that can be used to transform and analyze JSON data.

Below are some examples inspired by the [JQ tutorial](https://jqlang.github.io/jq/tutorial/).


## Inspecting Data

We can load some JSON data and pass it through Rhyme, unmodified.

````bash
curl 'https://api.github.com/repos/rhyme-lang/rhyme/commits?per_page=5' | 
  rhyme '.stdin'
````

The output is pretty unwieldy, but we can observe that there's an array at the top level, so a useful thing to do may be to inspect the first element.


````bash
curl 'https://api.github.com/repos/rhyme-lang/rhyme/commits?per_page=5' | 
  rhyme '.stdin.0'
````

::: details Show output
````json
{
  "sha": "30e5bdff9932c2aa79c3bc59fb0a0fcdb84ad0c2",
  "node_id": "C_kwDOKvd9l9oAKDMwZTViZGZmOTkzMmMyYWE3OWMzYmM1OWZiMGEwZmNkYjg0YWQwYzI",
  "commit": {
    "author": {
      "name": "Tiark Rompf",
      "email": "tiark.rompf@gmail.com",
      "date": "2024-12-30T02:14:58Z"
    },
    "committer": {
      "name": "Tiark Rompf",
      "email": "tiark.rompf@gmail.com",
      "date": "2024-12-30T02:14:58Z"
    },
    "message": "beef up let syntax more to enable function definitions",
    "tree": {
      "sha": "e696ec8c8f7c29e9631dae65ec7511be53768d4c",
      "url": "https://api.github.com/repos/rhyme-lang/rhyme/git/trees/e696ec8c8f7c29e9631dae65ec7511be53768d4c"
    },
    "url": "https://api.github.com/repos/rhyme-lang/rhyme/git/commits/30e5bdff9932c2aa79c3bc59fb0a0fcdb84ad0c2",
    "comment_count": 0,
    "verification": {
      "verified": false,
      "reason": "unsigned",
      "signature": null,
      "payload": null,
      "verified_at": null
    }
  },
  "url": "https://api.github.com/repos/rhyme-lang/rhyme/commits/30e5bdff9932c2aa79c3bc59fb0a0fcdb84ad0c2",
  "html_url": "https://github.com/rhyme-lang/rhyme/commit/30e5bdff9932c2aa79c3bc59fb0a0fcdb84ad0c2",
  "comments_url": "https://api.github.com/repos/rhyme-lang/rhyme/commits/30e5bdff9932c2aa79c3bc59fb0a0fcdb84ad0c2/comments",
  "author": {
    "login": "TiarkRompf",
    "id": 365911,
    "node_id": "MDQ6VXNlcjM2NTkxMQ==",
    "avatar_url": "https://avatars.githubusercontent.com/u/365911?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/TiarkRompf",
    "html_url": "https://github.com/TiarkRompf",
    "followers_url": "https://api.github.com/users/TiarkRompf/followers",
    "following_url": "https://api.github.com/users/TiarkRompf/following{/other_user}",
    "gists_url": "https://api.github.com/users/TiarkRompf/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/TiarkRompf/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/TiarkRompf/subscriptions",
    "organizations_url": "https://api.github.com/users/TiarkRompf/orgs",
    "repos_url": "https://api.github.com/users/TiarkRompf/repos",
    "events_url": "https://api.github.com/users/TiarkRompf/events{/privacy}",
    "received_events_url": "https://api.github.com/users/TiarkRompf/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false
  },
  "committer": {
    "login": "TiarkRompf",
    "id": 365911,
    "node_id": "MDQ6VXNlcjM2NTkxMQ==",
    "avatar_url": "https://avatars.githubusercontent.com/u/365911?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/TiarkRompf",
    "html_url": "https://github.com/TiarkRompf",
    "followers_url": "https://api.github.com/users/TiarkRompf/followers",
    "following_url": "https://api.github.com/users/TiarkRompf/following{/other_user}",
    "gists_url": "https://api.github.com/users/TiarkRompf/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/TiarkRompf/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/TiarkRompf/subscriptions",
    "organizations_url": "https://api.github.com/users/TiarkRompf/orgs",
    "repos_url": "https://api.github.com/users/TiarkRompf/repos",
    "events_url": "https://api.github.com/users/TiarkRompf/events{/privacy}",
    "received_events_url": "https://api.github.com/users/TiarkRompf/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false
  },
  "parents": [
    {
      "sha": "94ca37f893ca9207d85423996acd51ae675e1e6d",
      "url": "https://api.github.com/repos/rhyme-lang/rhyme/commits/94ca37f893ca9207d85423996acd51ae675e1e6d",
      "html_url": "https://github.com/rhyme-lang/rhyme/commit/94ca37f893ca9207d85423996acd51ae675e1e6d"
    }
  ]
}
````
:::


## Extracting Data

Now we can observe what fields exists in the output, and perhaps we decide 
to collect specific fields into an array of records for further processing.



````bash
curl 'https://api.github.com/repos/rhyme-lang/rhyme/commits?per_page=5' | 
  rhyme '[stdin.* | {author: .author.login, sha: .sha}]'
````

````json
[
  {
    "message": "beef up let syntax more to enable function definitions",
    "author": "TiarkRompf",
    "sha": "30e5bdff9932c2aa79c3bc59fb0a0fcdb84ad0c2"
  },
  {
    "message": "beef up let syntax",
    "author": "TiarkRompf",
    "sha": "94ca37f893ca9207d85423996acd51ae675e1e6d"
  },
  {
    "message": "fix glitches for empty arrays and objects",
    "author": "TiarkRompf",
    "sha": "02b23aab997cab0ccc231428ebacbbf9abb94275"
  },
  {
    "message": "add support for object syntax in parser",
    "author": "TiarkRompf",
    "sha": "827740958fde730968138f2f3ca38581c662aa25"
  },
  {
    "message": "c2 compiler does not need to create c1 IR",
    "author": "TiarkRompf",
    "sha": "d1a4302b9eacb1746f699ff89d16dbe37fa1343e"
  }
]
````

## Reshaping Data

We can also create a collection that's *indexed* by one of the
fields, effectively pivoting the data.


````bash
curl 'https://api.github.com/repos/rhyme-lang/rhyme/commits?per_page=5' | 
  rhyme 'stdin.* | { .sha: [.commit.message, .author.login] }'

````

````json
{
  "30e5bdff9932c2aa79c3bc59fb0a0fcdb84ad0c2": [
    "TiarkRompf",
    "beef up let syntax more to enable function definitions"
  ],
  "94ca37f893ca9207d85423996acd51ae675e1e6d": [
    "TiarkRompf",
    "beef up let syntax"
  ],
  "02b23aab997cab0ccc231428ebacbbf9abb94275": [
    "TiarkRompf",
    "fix glitches for empty arrays and objects"
  ],
  "827740958fde730968138f2f3ca38581c662aa25": [
    "TiarkRompf",
    "add support for object syntax in parser"
  ],
  "d1a4302b9eacb1746f699ff89d16dbe37fa1343e": [
    "TiarkRompf",
    "c2 compiler does not need to create c1 IR"
  ]
}
````


## Computing Statistics

Finally, we can easily compute statistics, such as the number of commits per author.


````bash
curl 'https://api.github.com/repos/rhyme-lang/rhyme/commits?per_page=1000' | 
  rhyme 'stdin.* | {.author.login: count .commit }'
````

````json
{
  "TiarkRompf": 435,
  "guo543": 29,
  "Kuigesi": 21,
  "IsaacFleetwood": 79,
  "supunab": 69
}
````

