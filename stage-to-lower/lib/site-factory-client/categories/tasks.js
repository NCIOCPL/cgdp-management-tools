'use strict'

const pRetry = require ('p-retry');

const SFCategoryBase = require('../category-base');

/**
 * Task API Calls
 */
class SFTasks extends SFCategoryBase {

    /**
     * Creates a new instance of SFSites
     *
     * @param {SFRequest} client A SFRequest client.
     * @param {object} config Configuration options.
     */
    constructor(client) {
        super(client);
    }

    /**
     * Get the status of a Work In Progress task.
     * @param {Number} taskId The ID of the task to report status on.
     */
    async taskStatus(taskId) {
        return this.client.get(`/wip/task/${taskId}/status`);
    }

    /**
     *
     * @param {Number} taskId The ID of the task to report status on.
     * @param {function(boolean complete) callback} pulse Optional function to notify periodically that the
     * task is still running. Receives a boolean value to note whether the task has completed.
     * Useful for letting the user know the program isn't hung.
     * @param {Number} pollingFrequency the number of seconds to wait between consecutive status checks.
     */
    async waitForCompletion(taskId, pulse, pollingFrequency = 60000) {

        if (!pollingFrequency || typeof pollingFrequency === 'number' || pollingFrequency < 1000)
            pollingFrequency = 60000;

        const wait = async () => {

            const attempt = async() => { return await this.taskStatus(taskId);}

            const status = await pRetry( attempt );

            const completed = (Number(status.wip_task.completed) != 0);

            if(pulse) {
                pulse(completed)
            }

            if(!completed) {
                await new Promise(resolve => setTimeout(resolve, pollingFrequency));
                return await wait();
            }

            return status;
        }

        await wait();
    }
}

module.exports = SFTasks;
