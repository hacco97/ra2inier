import markDownIt from 'markdown-it'

export let md = new markDownIt({
   breaks: true,
   linkify: true
})

export const imgLinkLike = /(?<=!\[.*\]\()((?!http).+)(?=\))/g

