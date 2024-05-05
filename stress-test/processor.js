const axios = require('axios') // axios 라이브러리 사용

/**
 * @BeforeRequest
 * requestParams - Use this parameter to customize what to send in the request (headers, body, cookies, etc.).
 * context - The virtual user's context.
 *   context.vars is a dictionary containing all defined variables.
 *   context.scenario is the scenario definition for the scenario currently being run by the virtual user.
 * events - An event emitter that can be used to communicate with Artillery.
 */

/**
 * @AfterRequest
 * A function invoked in an afterResponse gets the following arguments:
 * requestParams - Use this parameter to customize what to send in the request (headers, body, cookies, etc.).
 * response - Contains the response details (headers, body, etc.).
 * context - The virtual user's context.
 *   context.vars is a dictionary containing all defined variables.
 *   context.scenario is the scenario definition for the scenario currently being run by the virtual user.
 * events - An event emitter that can be used to communicate with Artillery.
 */
// requestParams, response, context, events, next
/**
 * 훅에서 에러 발생 방법
 * https://github.com/artilleryio/artillery/discussions/2296
 */

async function login({ target, email, password }) {
  try {
    const response = await axios.post(`${target}/auth/signin`, {
      email,
      password,
    })
    const result = {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }
    console.log(`[${email}] login success ${JSON.stringify(result, null, 2)}`)
    return result
  } catch (error) {
    console.error(`[${email}] Failed login error occurs`)
    console.error(error)
    throw error
  }
}

function createQueryString(qs) {
  const params = []
  for (const key in qs) {
    if (qs.hasOwnProperty(key)) {
      // 키와 값을 encodeURIComponent를 사용해 URL에 적합하게 인코딩
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(qs[key])}`)
    }
  }
  // 매개변수들을 '&'로 연결하고, 맨 앞에 '?'를 추가
  return '?' + params.join('&')
}

function getRandomIndex(arrayLength) {
  return Math.floor(Math.random() * arrayLength)
}

module.exports = {
  fnPrintVars: function (...args) {
    const [context, events, next] = args
    console.log(`[${context.vars.email}] ### fnPrintVars ###`)
    console.log(context.vars)
    next()
  },
  arVariableizeInProgressJob: function (...args) {
    const [requestParams, response, context, events, next] = args
    console.log(`[${context.vars.email}] ### arVariableizeInProgressJob ###`)
    const jobs = JSON.parse(response.body).items
    const inProgressJobs = jobs.filter((job) => job.jobStatus === 'In Progress')
    if (inProgressJobs.length < 1) {
      console.log(`[${context.vars.email}] Not Found In Progress Job`)
      next()
    }

    const randomIndex = getRandomIndex(inProgressJobs.length)
    const randomInProgressJob = inProgressJobs[randomIndex]
    console.log(
      `[${context.vars.email}] ${JSON.stringify(randomInProgressJob, null, 2)} to variableize as InProgressJob`,
    )
    context.vars.inProgressJob = randomInProgressJob

    next()
  },
  arSetAssigneeIdsInJobDetailPage: function (...args) {
    const [requestParams, response, context, events, next] = args
    console.log(`[${context.vars.email}] ### arSetAssigneeIds ###`)
    const job = context.vars.inProgressJob
    const assigneeIds = []
    job.orderedServices.forEach((orderedService) => {
      job.assignedTasks
        .filter((assignedTask) => assignedTask.orderedServiceId === orderedService.orderedServiceId)
        .forEach((filteredAssignedTask) => {
          assigneeIds.push(filteredAssignedTask.id)
        })
    })
    console.log(`[${context.vars.email}] Set Assignee Ids ${JSON.stringify(assigneeIds, null, 2)}`)
    context.vars.assigneeIds = assigneeIds

    next()
  },
  arPushJobId: function (...args) {
    const [requestParams, response, context, events, next] = args
    console.log(`### arPushJobId ###`)
    const jobId = JSON.parse(response.body).id
    const jobIds = context.vars.jobIds ? context.vars.jobIds : []
    // jobIds.push(jobId)
    // context.vars.jobIds = jobIds
    if (context.vars.jobIds) {
      console.log('context.vars.jobIds 이미 존재. 데이터 추가함')
      context.vars.jobIds.push(jobId)
    } else {
      console.log('context.vars.jobIds 초기화')
      context.vars.jobIds = [jobId]
    }

    console.log('jobId 출력')
    console.log(context.vars.jobIds)

    next()
  },
  bsLogin: async function (...args) {
    const [context, events] = args
    console.log('######## Login ########', context.vars.target)
    const { token, refreshToken } = await login({
      target: context.vars.target,
      email: context.vars.email,
      password: context.vars.password,
    })
    context.vars['token'] = token
    context.vars['refreshToken'] = refreshToken
  },
  asLogout: async function (...args) {
    const [context, events] = args
    console.log(`[${context.vars.email}] ######## Logout ########`)
    try {
      await axios.post(`${context.vars.target}/auth/signout`, {
        token: context.vars.token,
      })
      console.log(`[${context.vars.email}] logout success`)
    } catch (error) {
      console.error(`[${context.vars.email}] Failed login error occurs`)
      console.error(error)
      throw error
    }
  },
  brLog: function (...args) {
    const [requestParams, context, events, next] = args
    const varaibles = context.vars
    const qsString = requestParams.qs ? createQueryString(requestParams.qs) : ''
    const path = requestParams.url.replace(context.vars.target, '') + qsString
    console.log(`[${varaibles.email}] [BeforeRequest] ${requestParams.method} ${path}`)
    next()
  },
  arLog: async function (...args) {
    const [requestParams, response, context, events, next] = args
    const varaibles = context.vars

    console.log(
      `[${varaibles.email}] [AfterResponse] ${response.client._httpMessage.method} ${response.client._httpMessage.path} ${response.statusCode} ${response.statusMessage}`,
    )
    // console.log(args)
    if (response.statusCode === 401) {
      const { token, refreshToken } = await login({
        target: context.vars.target,
        email: context.vars.email,
        password: context.vars.password,
      })
      context.vars['token'] = token
      context.vars['refreshToken'] = refreshToken
    }

    // next()
  },
  arLogWithBody: function (...args) {
    const [requestParams, response, context, events, next] = args
    const varaibles = context.vars

    console.log(
      `[${varaibles.email}] [AfterResponse] ${response.client._httpMessage.method} ${
        response.client._httpMessage.path
      } ${response.statusCode} ${response.statusMessage} ${JSON.stringify(JSON.parse(response.body), null, 2)}`,
    )

    next()
  },
}
