---
title: "Code Organization"
path: "/code-organization"
order: 19
---

People often ask what's the best way to structure their applications. React is intentionally light on this guidance because React is just one tool you use to make your application. Just because you use promises doesn't mean you should structure your app one way; same with React. That is to say, it is intentionally left to you and the community to develop our own best practices. There are many ways to do this.

I will share with you how I like to structure my apps but do not take it as gospel, this is just one opinion. I like to optimize my apps for deletability. Often when I've worked on long-term projects, a lot of garbage will get collected up in the code base that no one knows what it does: dead CSS, components, tests, etc.

As such, I like to group everything together for a single component in its own folder: its tests, its markup, its stylings, everything. If it has components that only go with that component, they can go in the same folder as well. That way, whenver the component falls out of use, you can delete the whole folder and everything goes with it. Beyond that, it's useful to see everything you need for one component in one place.

Here's the example I show people: [photo-gallery][pg].

I wrote this an example app of how it could be done. It uses [Flow][flow], CSS Modules, and Preact but the principles don't change. Each component has its entire world in that component, so if we swap out components and don't use one of them, we can delete old components and all their tests and CSS go with it.

This is just to give you an idea. It's up to you how you want to organize your projects.

[pg]: https://github.com/btholt/photo-gallery/
